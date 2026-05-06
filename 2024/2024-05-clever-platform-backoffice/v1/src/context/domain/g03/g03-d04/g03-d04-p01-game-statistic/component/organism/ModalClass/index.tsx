import { useState, useEffect } from 'react';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination } from '@mantine/core';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g03/g03-d04/local/api';
import StoreGlobalPersist from '@store/global/persist';
import { GetClassResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TeacherStudentParamSearch } from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import CWSelect from '@component/web/cw-select';
import CWPagination from '@component/web/cw-pagination';
import usePagination from '@global/hooks/usePagination';
//  const [filters, setFilters] = useState<Partial<TeacherStudentParamSearch>>();
interface ModalClassProps extends ModalProps {
  open: boolean;
  schoolId?: number;
  setFilters?: (value: Partial<TeacherStudentParamSearch>) => void;
  filters?: Partial<TeacherStudentParamSearch>;
}
const ModalClass = ({
  open,
  onClose,
  setFilters,
  schoolId,
  filters,
}: ModalClassProps) => {
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<GetClassResponse[]>([]);
  const [optionAcademicYear, setOptionAcademicYear] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionYear, setOptionYear] = useState<{ label: string; value: string }[]>([]);
  const [filtersClass, setFiltersClass] = useState<Partial<TeacherStudentParamSearch>>();
  const [selectedValue, setSelectedValue] = useState<GetClassResponse | undefined>();
  const { pagination, setPagination } = usePagination({ isModal: true });

  useEffect(() => {
    if (open) {
      API.academicYear
        .GetAcademicYearRangesList({
          page: 1,
          limit: 10,
          school_id: +userData?.school_id || schoolId,
        })
        .then((res) => {
          if (res.status_code === 200 && res.data.length > 0) {
            setOptionAcademicYear(
              res?.data.map((item) => ({
                label: item.name,
                value: item.name,
              })),
            );
          }
        });
      API.academicYear
        .GetDropdownYearList({
          page: 1,
          limit: -1,
        })
        .then((res) => {
          if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
            setOptionYear(
              res.data.map((item) => ({
                label: item,
                value: item,
              })),
            );
          }
        });
      API.academicYear
        .GetDropdownClassesList({
          page: pagination.page,
          limit: -1,
          school_id: +userData?.school_id || schoolId,
        })
        .then((res) => {
          if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
            setRecords(res.data);
            setPagination((prev) => ({
              ...prev,
              total_count: res._pagination?.total_count || res.data.length,
            }));
          }
        });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      API.academicYear
        .GetDropdownClassesList({
          page: pagination.page,
          limit: pagination.limit,
          academic_year: filtersClass?.academic_year?.toString(),
          year: filtersClass?.year,
          school_id: +userData?.school_id || schoolId,
        })
        .then((res) => {
          if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
            setRecords(res.data);
            setPagination((prev) => ({
              ...prev,
              total_count: res._pagination?.total_count || res.data.length,
            }));
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 200);
        });
    }
  }, [pagination.page, pagination.limit, filtersClass, open]);

  const handleSelectRow = (item: GetClassResponse) => {
    setSelectedValue(item);
  };

  const handleSelect = () => {
    if (selectedValue) {
      if (setFilters) {
        setFilters({
          ...filters,
          academic_year: selectedValue.academic_year,
          year: selectedValue.year,
          class_name: selectedValue.name,
        });
      }
      setSelectedValue(undefined);
      onClose?.();
    } else {
      showMessage('กรุณาเลือกห้องเรียน', 'error');
    }
  };
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <>
      <Modal
        className="w-1/2"
        disableCancel
        disableOk
        title="เลือกห้องเรียน"
        open={open}
        onClose={() => {
          setSelectedValue(undefined);
          setFiltersClass({});
          onClose?.();
        }}
      >
        <div className="mb-5 grid w-full grid-cols-2 gap-5">
          <CWSelect
            onChange={(e) => {
              setFiltersClass({
                ...filtersClass,
                academic_year: e.target.value,
                year: undefined,
              });
            }}
            options={optionAcademicYear}
            value={filtersClass?.academic_year}
            title="ปีการศึกษา"
          />
          <CWSelect
            onChange={(e) => {
              setFiltersClass({ ...filtersClass, year: e.target.value });
            }}
            options={optionYear}
            value={filtersClass?.year}
            title="ชั้นปี"
            disabled={!filtersClass?.academic_year}
          />
        </div>
        <div className="border-t-3 w-full border" />
        <div className="flex flex-col gap-2">
          <div className="h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : (
              records.map((item, index) => (
                <div className="my-5 flex w-full" key={index}>
                  <div className="flex flex-1">
                    <div
                      key={index}
                      onClick={() => {
                        handleSelectRow(item);
                      }}
                      className={cn('w-full')}
                    >
                      <div
                        className={`border-primary-200 flex cursor-pointer items-center justify-between rounded-md border-[1px] p-2 px-4 hover:bg-gray-100 ${selectedValue?.id === item.id ? 'border-primary' : 'border-gray-200'}`}
                      >
                        <div className="flex flex-1">{item.id}</div>
                        <div className="flex flex-1">{item.academic_year}</div>
                        <div className="flex flex-1">{item.year}</div>
                        <div className="flex flex-1">{`ห้อง ${item.name}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between">
            <CWPagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total_count / pagination.limit)}
              onPageChange={handlePageChange}
              pageSize={pagination.limit}
              setPageSize={handlePageSizeChange}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              className="btn btn-outline-primary w-44"
              onClick={() => {
                setSelectedValue(undefined);
                onClose?.();
              }}
            >
              ย้อนกลับ
            </button>
            <button
              className="btn btn-primary w-44"
              onClick={handleSelect}
              disabled={selectedValue === undefined}
            >
              เลือก
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalClass;
