import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import Modal from '../../atom/wc-a-modal';
import Pagination from '@core/design-system/library/component/web/Pagination';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import Button from '@core/design-system/library/component/web/Button';
import { School } from '@domain/g01/g01-d02/local/type';
import API from '@domain/g01/g01-d02/local/api';
import { useEffect, useState } from 'react';
import InputCheckbox from '@core/design-system/library/component/web/InputCheckbox';
import showMessage from '@global/utils/showMessage';
import CWPagination from '@component/web/cw-pagination';
import usePagination from '@global/hooks/usePagination';

interface ModalAddSchoolProps {
  affiliationId: string;
  contractId?: string;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function ModalAddSchool({
  affiliationId,
  contractId,
  open,
  onClose,
  className,
}: ModalAddSchoolProps) {
  const [schoolRecords, setSchoolRecords] = useState<School[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    page,
    pageSize,
    totalCount: totalPage,
    setPage,
    setPageSize,
    setTotalCount: setTotalPage,
  } = usePagination({ isModal: true });

  useEffect(() => {
    API.affiliationContract
      .GetAllSchoolsInAffiliation(affiliationId, {
        page: page,
        limit: pageSize,
      })
      .then((res) => {
        if (res.status_code === 200) {
          const { data, _pagination } = res;
          setSchoolRecords(data);
          setTotalPage(_pagination.total_count);
        }
      });
  }, [affiliationId, open, page, pageSize]);

  const totalPageAll = Math.ceil(totalPage / pageSize);

  // if page size have been change, always set page back to 1
  useEffect(() => {
    setPage(1);
    if (page > totalPage) {
      setPage(totalPage);
    }
  }, [pageSize, totalPage]);

  function toggleSelectedId(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pId) => pId !== id);
      return [...prev, id];
    });
  }

  function handleSubmit() {
    if (contractId) {
      API.affiliationContract
        .AddContractSchools(
          +contractId,
          selectedIds.map((id) => +id),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('เพิ่มโรงเรียนสำเร็จ', 'success');
            handleOnClose();
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาบันทึกสัญญาก่อน', 'error');
    }
  }

  function handleOnClose() {
    setSelectedIds([]);
    if (onClose) onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      className={cn('w-3/4 font-noto-sans-thai', className)}
      title={'เลือกโรงเรียน'}
      footer={
        <div className="flex justify-between">
          <Button
            title={'ย้อนกลับ'}
            variant="primary"
            className="min-w-[120px] px-5"
            onClick={handleOnClose}
            outline
          />
          <Button
            title={'เลือก'}
            variant="primary"
            className="min-w-[120px] px-5"
            disabled={!selectedIds.length}
            onClick={() => {
              handleSubmit();
              handleOnClose();
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="border-b border-neutral-200 pb-5">
          <div className="relative w-[200px]">
            <input
              type="text"
              placeholder="รหัสโรงเรียน, ชื่อโรงเรียน..."
              className="form-input !pr-8"
            />
            <button type="button" className="!absolute right-0 top-0 mr-2 h-full">
              <IconSearch className="!h-5 !w-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {schoolRecords.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีข้อมูลโรงเรียน</p>
          ) : (
            schoolRecords.map((record) => (
              <div className="flex gap-2" key={record.id}>
                <InputCheckbox
                  id={`${record.school_code}-checkbox`}
                  onChange={(evt) => {
                    evt.preventDefault();
                    toggleSelectedId(record.id);
                  }}
                  checked={!!selectedIds.includes(record.id)}
                />
                <label
                  htmlFor={`${record.school_code}-checkbox`}
                  className={cn(
                    'flex w-full gap-4 rounded border px-4 py-2',
                    selectedIds.includes(record.id) && 'border-primary',
                  )}
                >
                  <div className="flex-1">{record.id}</div>
                  <div className="flex-1">{record.school_name}</div>
                </label>
              </div>
            ))
          )}
        </div>
        {schoolRecords.length > 0 && (
          <CWPagination
            currentPage={page}
            pageSize={pageSize}
            totalPages={totalPageAll}
            onPageChange={setPage}
            setPageSize={setPageSize}
          />
        )}
      </div>
    </Modal>
  );
}
