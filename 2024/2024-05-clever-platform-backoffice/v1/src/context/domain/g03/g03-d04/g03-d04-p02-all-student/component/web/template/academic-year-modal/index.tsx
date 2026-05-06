import CWButton from '@component/web/cw-button';
import { Modal } from '@component/web/cw-modal';
import CWPagination from '@component/web/cw-pagination';
import { Pagination } from '@domain/g03/g03-d03/local/type';
import API from '@domain/g03/g03-d04/local/api';
import usePagination from '@global/hooks/usePagination';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

const AcademicYearModal = ({
  isOpen,
  onClose,
  onOk,
  ...rest
}: {
  isOpen: boolean;
  onClose: () => void;
  onOk: (selectedAcademicYear?: string) => void;
}) => {
  const [academicYearList, setAcademicYearList] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const { pagination, setPagination } = usePagination({ isModal: true });

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const res = await API.academicYear.GetDropdownAcademicYear();
        if (res.status_code === 200) {
          setAcademicYearList(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res.data.length,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch academic years', error);
      }
    };

    fetchAcademicYears();
  }, []);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <Modal
      className="h-auto min-h-[300px] w-[650px]"
      open={isOpen}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="ปีการศึกษา"
      {...rest}
    >
      <div className="flex flex-col gap-4">
        {academicYearList.length > 0 ? (
          academicYearList.map((year, index) => (
            <div
              key={year}
              className={`flex h-auto w-full cursor-pointer flex-row justify-between rounded-md border px-4 py-2 ${
                selectedIndex === index ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className="w-1/2"># {index + 1}</span>
              <span className="w-1/2">{year}</span>
            </div>
          ))
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg bg-gray-50">
            <span className="text-lg font-medium text-gray-600">ไม่พบข้อมูล</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <CWPagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total_count / pagination.limit)}
          onPageChange={handlePageChange}
          pageSize={pagination.limit}
          setPageSize={handlePageSizeChange}
        />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <CWButton
          className="w-[120px]"
          title="ย้อนกลับ"
          onClick={() => onClose()}
          outline={true}
        />

        <CWButton
          className="w-[120px]"
          title="เลือก"
          onClick={() =>
            selectedIndex !== undefined
              ? onOk(String(academicYearList[selectedIndex]))
              : onClose()
          }
        />
      </div>
    </Modal>
  );
};

export default AcademicYearModal;
