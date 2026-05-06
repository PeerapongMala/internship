import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination } from '@mantine/core';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import ModalNewCreateAcademicYear from '../cw-modal-create-academicyear';
import showMessage from '@global/utils/showMessage';

import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { GetAcademicYearRangesResponse } from '@domain/g03/g03-d04/local/api/group/academic-year/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWPagination from '@component/web/cw-pagination';
import API from '@domain/g03/g03-d04/local/api';
import { getAcademicYearRange } from '@global/utils/store/get-academic-year-range-data';
import usePagination from '@global/hooks/usePagination';


interface ModalAcademicYearProps extends ModalProps {
  open: boolean;
  setSelectedValueDateRange: (value: GetAcademicYearRangesResponse | null) => void;
  setDateRange?: (value: { startDate: Date; endDate: Date }) => void;
  schoolId?: number;
  deleteMode?: boolean;
  createMode?: boolean;
  description?: string
}

const CWModalAcademicYearRange = ({
  open,
  onClose,
  setSelectedValueDateRange,
  setDateRange,
  schoolId,
  deleteMode = true,
  createMode = true,
  title = 'ปีการศึกษา',
  description
}: ModalAcademicYearProps) => {
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const [showModalNewCreate, setShowModalNewCreate] = useState(false);
  const academicYearRangeData = getAcademicYearRange();
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState<GetAcademicYearRangesResponse[]>([]);
  const [selectedValue, setSelectedValue] =
    useState<GetAcademicYearRangesResponse | null>(
      Array.isArray(academicYearRangeData)
        ? academicYearRangeData[0]
        : academicYearRangeData,
    );

  const { pagination, setPagination } = usePagination({ isModal: true });

  useEffect(() => {
    if (Array.isArray(academicYearRangeData) && academicYearRangeData.length > 0) {
      setSelectedValue(academicYearRangeData[0]);
    }
    handleFetchData();
  }, []);

  const onClickNewCreate = () => {
    setShowModalNewCreate(true);
  };

  const handleCloseModalNewCreate = () => {
    handleFetchData();
    setShowModalNewCreate(false);
  };

  const convertToThaiFormat = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const thaiYear = date.getFullYear() + 543;
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
          if (res?.data?.length > 0) {
            setSelectedValue(res?.data[0]);
            (
              StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
            ).setAcademicYearRangeData(res?.data[0]);
            (
              StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
            ).setDefaultAcademicYearRangeData(res?.data[0]);
          }
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
      (
        StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
      ).setAcademicYearRangeData(selectedValue);
      (
        StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
      ).setDefaultAcademicYearRangeData(selectedValue);
      onClose?.();
    } else {
      showMessage('กรุณาเลือกปีการศึกษา', 'error');
    }
  };

  return (
    <>
      <Modal
        className="w-full md:w-1/3" // Responsive width
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
          setSelectedValue(null);
          onClose?.();
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="h-[300px] overflow-y-auto md:h-[400px]">
            {loading ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : (
              records.map((item, index) => (
                <div className="my-2 flex w-full md:my-3" key={index}>
                  <div className="flex flex-1">
                    <div
                      key={index}
                      onClick={() => {
                        handleSelectRow(item);
                      }}
                      className={cn('w-full')}
                    >
                      <div
                        className={`border-primary-200 flex cursor-pointer flex-col items-center justify-between rounded-md border-[1px] p-2 px-4 hover:bg-gray-100 md:flex-row ${selectedValue?.id === item.id ? 'border-primary' : 'border-gray-200'}`}
                      >
                        <div className="flex flex-1 text-sm md:text-base">
                          {item.name}
                        </div>
                        <div className="mt-1 text-xs md:mt-0 md:text-base">{`${convertToThaiFormat(new Date(item.start_date))} - ${convertToThaiFormat(new Date(item.end_date))}`}</div>
                      </div>
                    </div>
                  </div>
                  {deleteMode && (
                    <button
                      className="btn ml-2 border-none !px-1 !shadow-none duration-200 hover:scale-95 hover:text-red-500 md:ml-5 md:!px-2"
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                    >
                      <IconClose />
                    </button>
                  )}
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
          <div className="mt-2 flex flex-col items-center justify-between gap-2 md:mt-4 md:flex-row">
            <button
              className="btn btn-outline-primary w-full md:w-44"
              onClick={() => {
                setSelectedValue(null);
                onClose?.();
              }}
            >
              ย้อนกลับ
            </button>
            <div className="flex w-full gap-2 md:w-auto">
              {createMode && (
                <button
                  className="btn btn-outline-primary flex-1 md:w-44"
                  onClick={onClickNewCreate}
                >
                  สร้างใหม่
                </button>
              )}
              <button className="btn btn-primary flex-1 md:w-44" onClick={handleSelect}>
                เลือก
              </button>
            </div>
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

export default CWModalAcademicYearRange;
