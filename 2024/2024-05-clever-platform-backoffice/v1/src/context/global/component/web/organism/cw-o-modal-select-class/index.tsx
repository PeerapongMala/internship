import { useState, useEffect } from 'react';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g03/g03-d04/local/api';
import { GetClassResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TeacherStudentParamSearch } from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import CWSelect from '@component/web/cw-select';
import CWPagination from '@component/web/cw-pagination';
import { TPagination } from '@global/types/api';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import usePagination from '@global/hooks/usePagination';

interface ModalClassProps extends ModalProps {
  open: boolean;
  /**
   * optional for specific school id
   */
  schoolId?: number;
  initialFilter?: Partial<TeacherStudentParamSearch>;
  onSelectClass?: (
    value: Partial<TeacherStudentParamSearch> & { class_id: number },
  ) => void;
  autoSelectFirstClass?: boolean;
}

const CWModalSelectClass = ({
  open,
  onClose,
  onSelectClass,
  schoolId,
  initialFilter,
  autoSelectFirstClass,
}: ModalClassProps) => {
  const userData = getUserData();

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<GetClassResponse[]>([]);

  const [optionAcademicYear, setOptionAcademicYear] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionYear, setOptionYear] = useState<{ label: string; value: string }[]>([]);
  const [filtersClass, setFiltersClass] = useState<Partial<TeacherStudentParamSearch>>({
    ...initialFilter,
    academic_year: userData.academic_year ?? undefined,
  });
  const [selectedValue, setSelectedValue] = useState<GetClassResponse | undefined>();
  const { pagination, setPagination } = usePagination({ isModal: true });

  useEffect(() => {
    if (open) {
      API.academicYear
        .GetAcademicYearRangesList({
          page: 1,
          limit: -1,
          school_id: schoolId ?? +userData?.school_id,
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
          school_id: schoolId ?? +userData?.school_id,
        })
        .then((res) => {
          if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
            setRecords(res.data);
            setPagination((prev) => ({
              ...prev,
              total_count: res._pagination?.total_count,
            }));
          }
        });

      setFiltersClass((prev) => ({
        ...prev,
        academic_year: userData.academic_year ?? undefined,
      }));
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      API.academicYear
        .GetDropdownClassesList({
          page: pagination.page,
          limit: pagination.limit,
          academic_year:
            filtersClass?.academic_year?.toString() ??
            userData?.academic_year?.toString(),
          year: filtersClass?.year,
          school_id: schoolId ?? +userData?.school_id,
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
  }, [
    pagination.page,
    pagination.limit,
    open,
    filtersClass.academic_year,
    filtersClass.year,
  ]);

  // useEffect(() => {
  //   if (!autoSelectFirstClass || !userData?.school_id) return;

  //   API.academicYear
  //     .GetDropdownClassesList({
  //       page: 1,
  //       limit: 1,
  //       school_id: schoolId ?? +userData.school_id,
  //     })
  //     .then((res) => {
  //       if (res.status_code === 200 && res.data.length > 0) {
  //         const data = res.data[0];
  //         (
  //           StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
  //         ).setClassData({
  //           ...data,
  //           class_id: data.id,
  //           class_name: data.name,
  //         });
  //       }
  //     });
  // }, []);

  const handleSelectRow = (item: GetClassResponse) => {
    setSelectedValue(item);
  };

  const handleSelect = () => {
    (
      StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
    ).setClassData(
      selectedValue
        ? { ...selectedValue, class_id: selectedValue.id, class_name: selectedValue.name }
        : undefined,
    );

    if (!selectedValue) {
      showMessage('กรุณาเลือกห้องเรียน', 'error');
      return;
    }

    onSelectClass?.({
      ...initialFilter,
      academic_year: selectedValue.academic_year,
      year: selectedValue.year,
      class_name: selectedValue.name,
      class_id: selectedValue.id,
    });

    setSelectedValue(undefined);
    onClose?.();
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
        className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2"
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
        <div className="mb-5 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {' '}
          {/* Responsive grid */}
          <CWSelect
            onChange={(e) => {
              setFiltersClass((prev) => ({
                ...prev,
                academic_year: e.target.value,
                year: undefined,
              }));
            }}
            options={optionAcademicYear}
            value={filtersClass?.academic_year}
            label="ปีการศึกษา"
            title="ทั้งหมด"
          />
          <CWSelect
            onChange={(e) => {
              setFiltersClass({ ...filtersClass, year: e.target.value });
            }}
            options={optionYear}
            value={filtersClass?.year ?? '-'}
            label="ชั้นปี"
            title="ทั้งหมด"
            disabled={!filtersClass?.academic_year}
          />
        </div>
        <div className="border-t-3 w-full border" />
        <div className="flex flex-col gap-2">
          <div className="h-[300px] overflow-y-auto md:h-[400px]">
            {' '}
            {/* Responsive height */}
            {loading ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : (
              <>
                <div
                  className={`border-primary-200 mt-5 hidden items-center justify-between border-[1px] bg-neutral-100 p-2 px-4 md:flex`}
                >
                  <div className="flex flex-1">รหัส</div>
                  <div className="flex flex-1">ปีการศึกษา</div>
                  <div className="flex flex-1">ชั้นปี</div>
                  <div className="flex flex-1">ห้อง</div>
                </div>
                {records.map((item, index) => (
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
                          className={`border-primary-200 flex cursor-pointer flex-col rounded-md border-[1px] p-2 px-4 hover:bg-gray-100 md:flex-row md:items-center md:justify-between ${selectedValue?.id === item.id ? 'border-primary' : 'border-gray-200'}`}
                        >
                          <div className="flex flex-1">
                            <span className="font-semibold md:hidden">รหัส: </span>
                            {item.id}
                          </div>
                          <div className="flex flex-1">
                            <span className="font-semibold md:hidden">ปีการศึกษา: </span>
                            {item.academic_year}
                          </div>
                          <div className="flex flex-1">
                            <span className="font-semibold md:hidden">ชั้นปี: </span>
                            {item.year}
                          </div>
                          <div className="flex flex-1">
                            <span className="font-semibold md:hidden">ห้อง: </span>
                            {`ห้อง ${item.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
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

          <div className="mt-4 flex items-center justify-between gap-4 sm:flex-row">
            <button
              className="btn btn-outline-primary w-full sm:w-44"
              onClick={() => {
                setSelectedValue(undefined);
                onClose?.();
              }}
            >
              ย้อนกลับ
            </button>
            <button
              className="btn btn-primary w-full sm:w-44"
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

export default CWModalSelectClass;
