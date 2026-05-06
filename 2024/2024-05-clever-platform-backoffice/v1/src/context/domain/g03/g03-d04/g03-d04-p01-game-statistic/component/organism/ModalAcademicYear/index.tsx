import { useState, useEffect, ReactNode } from 'react';
import dayjs from 'dayjs';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination } from '@mantine/core';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import ModalNewCreateAcademicYear from '../ModalNewCreateAcademicYear';
import showMessage from '@global/utils/showMessage';
import API from '../../../../local/api';
import StoreGlobalPersist from '@store/global/persist';
import { GetAcademicYearRangesResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWPagination from '@component/web/cw-pagination';
import usePagination from '@global/hooks/usePagination';
interface ModalAcademicYearProps extends ModalProps {
  open: boolean;
  setSelectedValueDateRange: (value: GetAcademicYearRangesResponse | undefined) => void;
  setDateRange?: (value: { startDate: Date; endDate: Date }) => void;
  schoolId?: number;
  description?: ReactNode;
}
const ModalAcademicYear = ({
  open,
  onClose,
  setSelectedValueDateRange,
  setDateRange,
  schoolId,
  title = 'เลือกปีการศึกษา',
  description,
}: ModalAcademicYearProps) => {
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const [showModalNewCreate, setShowModalNewCreate] = useState(false);

  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState<GetAcademicYearRangesResponse[]>([]);
  const [selectedValue, setSelectedValue] = useState<
    GetAcademicYearRangesResponse | undefined
  >();
  const { pagination, setPagination } = usePagination();

  // open modal create new academic year
  const onClickNewCreate = () => {
    setShowModalNewCreate(true);
  };

  const handleCloseModalNewCreate = () => {
    handleFetchData();
    setShowModalNewCreate(false);
  };

  const convertToThaiFormat = (date: Date) => {
    // Get date components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed

    // Convert to Thai Buddhist Era (add 543 years)
    const thaiYear = date.getFullYear() + 543;

    // Format as DD/MM/YYYY
    return `${day}/${month}/${thaiYear}`;
  };

  const handleFetchData = async () => {
    setLoading(true);
    API.academicYear
      .GetAcademicYearRangesList({
        page: pagination.page,
        limit: pagination.limit,
        school_id: +userData?.school_id || schoolId,
      })
      .then((res) => {
        if (res.status_code === 200) {
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
  };
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  useEffect(() => {
    handleFetchData();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (open) {
      setSelectedValueDateRange(undefined);
      handleFetchData();
    }
  }, [open]);

  const handleDelete = (id: number) => {
    API.academicYear
      .DeleteAcademicYearRanges({
        academicYearRangeId: id,
      })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('ลบปีการศึกษาสำเร็จ', 'success');
          handleFetchData();
        }
        if (res.status_code === 409) {
          showMessage('มีการใช้งานในปัจจุบัน ไม่สามารถถูกลบได้', 'warning');
        } else {
          showMessage('ลบปีการศึกษาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      });
  };

  const handleSelectRow = (item: GetAcademicYearRangesResponse) => {
    setSelectedValue(item);
  };

  const handleSelect = () => {
    if (selectedValue) {
      setSelectedValueDateRange(selectedValue);
      if (setDateRange) {
        setDateRange({
          startDate: new Date(selectedValue.start_date),
          endDate: new Date(selectedValue.end_date),
        });
      }
      setSelectedValue(undefined);
      onClose?.();
    } else {
      showMessage('กรุณาเลือกปีการศึกษา', 'error');
    }
  };

  return (
    <>
      <Modal
        className="w-1/3"
        disableCancel
        disableOk
        title={
          <div className="flex flex-col">
            {title}
            <span className="!text-sm font-normal text-gray-500">{description}</span>
          </div>
        }
        open={open}
        onClose={() => {
          setSelectedValue(undefined);
          onClose?.();
        }}
      >
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
                        <div className="flex flex-1">{item.name}</div>
                        <div>{`${convertToThaiFormat(new Date(item.start_date))} - ${convertToThaiFormat(new Date(item.end_date))}`}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn ml-5 border-none !px-2 !shadow-none"
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    <IconClose />
                  </button>
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
          {/* <div className="flex justify-between">
            <div className="flex w-96 items-center gap-2">
              <div>
                แสดง {page} จาก {Math.ceil(totalRecords / pageSize)} หน้า
              </div>
              <Select
                menuPosition="fixed"
                className="z-10 w-28"
                options={[
                  { value: '10', label: '10' },
                  { value: '20', label: '20' },
                  { value: '50', label: '50' },
                ]}
                defaultValue={{ value: '10', label: '10' }}
                onChange={(value) => {
                  setPageSize(Number(value.value));
                }}
                isSearchable={false}
              />
            </div>
            <Pagination
              value={page}
              total={Math.ceil(totalRecords / pageSize)}
              onChange={(page) => {
                setPage(page);
              }}
            />
          </div> */}
          <div className="mt-4 flex items-center gap-2">
            {/* <button
              className="btn btn-outline-primary w-44"
              onClick={() => {
                setSelectedValue(undefined);
                onClose?.();
              }}
            >
              ย้อนกลับ
            </button> */}
            <button className="btn btn-outline-primary w-full" onClick={onClickNewCreate}>
              สร้างใหม่
            </button>
            <button className="btn btn-primary w-full" onClick={handleSelect}>
              เลือก
            </button>
          </div>
        </div>
      </Modal>
      <ModalNewCreateAcademicYear
        open={showModalNewCreate}
        onClose={handleCloseModalNewCreate}
        schoolId={schoolId}
      />
    </>
  );
};

export default ModalAcademicYear;
