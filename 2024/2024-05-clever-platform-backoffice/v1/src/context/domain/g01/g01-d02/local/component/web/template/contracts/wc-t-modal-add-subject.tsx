import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import Modal from '../../atom/wc-a-modal';
import Pagination from '@core/design-system/library/component/web/Pagination';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import Button from '@core/design-system/library/component/web/Button';
import { Subject, SeedYear } from '@domain/g01/g01-d02/local/type';
import API from '@domain/g01/g01-d02/local/api';
import { useEffect, useMemo, useState } from 'react';
import InputCheckbox from '@core/design-system/library/component/web/InputCheckbox';
import Select from '@core/design-system/library/component/web/Select';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWPagination from '@component/web/cw-pagination';
import usePagination from '@global/hooks/usePagination';

interface ModalAddSubjectProps {
  affiliationId: string;
  contractId?: string;
  platformId?: number;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function ModalAddSubject({
  affiliationId,
  contractId,
  platformId,
  open,
  onClose,
  className,
}: ModalAddSubjectProps) {
  const [subjectRecords, setSubjectRecords] = useState<Subject[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [yearList, setYearList] = useState<SeedYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');

  const { page, pageSize, totalCount, setPage, setPageSize, setTotalCount } =
    usePagination({ isModal: true });

  const totalPage = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [totalCount, pageSize],
  );
  useEffect(() => {
    if (open) {
      if (platformId) {
        API.affiliationContract
          .GetSubjectGroupList(platformId, {
            page: page,
            limit: pageSize,
            seed_year_id: selectedYear,
          })
          .then((res) => {
            console.log(res);

            if (res.status_code === 200) {
              const { data, _pagination } = res;
              setSubjectRecords(data);
              setTotalCount(_pagination.total_count);
              setSelectedIds([]);
            } else {
              showMessage(res.message, 'error');
            }
          });
      } else {
        showMessage('กรุณาบันทึกสัญญาก่อน', 'warning');
      }
    }
  }, [affiliationId, open, page, pageSize, selectedYear, platformId]);

  useEffect(() => {
    API.seedYear.Get().then((res) => {
      console.log(res);
      if (res.status_code === 200) {
        const { data } = res;
        setYearList(data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, []);

  // if page size have been change, always set page back to 1
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  function toggleSelectedId(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pId) => pId !== id);
      return [...prev, id];
    });
  }

  function handleSubmit() {
    if (contractId) {
      API.affiliationContract
        .AddContractSubjects(
          +contractId,
          selectedIds.map((id) => ({
            subject_group_id: +id,
            is_enabled: false,
          })),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('เพิ่มหลักสูตรสำเร็จ', 'success');
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      className={cn('w-3/4 font-noto-sans-thai', className)}
      title={'เลือกหลักสูตร'}
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
          <div className="relative flex gap-4">
            <div className="flex-1">
              <CWSelect
                options={yearList.map((record) => {
                  return {
                    label: record.short_name,
                    value: record.id.toString(),
                  };
                })}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setSelectedYear(value);
                  setPage(1);
                }}
                title={'ชั้นปี'}
                value={selectedYear}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          {subjectRecords.length ? (
            subjectRecords.map((record) => {
              return (
                <div className="flex items-start gap-2" key={record.id}>
                  <InputCheckbox
                    id={`${record.id}-checkbox`}
                    onChange={(evt) => {
                      evt.preventDefault();
                      toggleSelectedId(record.id);
                    }}
                    className="pt-2.5"
                    checked={!!selectedIds.includes(record.id)}
                  />
                  <label
                    htmlFor={`${record.id}-checkbox`}
                    className="flex w-full flex-col gap-2 font-normal"
                  >
                    <div
                      className={cn(
                        'flex w-full gap-4 rounded border px-4 py-2',
                        selectedIds.includes(record.id) && 'border-primary',
                      )}
                    >
                      <div className="flex-1">{record.id}</div>
                      <div className="flex-1">{record.curriculum_group}</div>
                      <div className="flex-1">{record.year}</div>
                      <div className="flex-1">{record.subject_group}</div>
                    </div>
                    <div>{record.subjects?.join(', ')}</div>
                  </label>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center">ไม่พบข้อมูล</div>
          )}
        </div>
        {subjectRecords.length > 0 && (
          <CWPagination
            currentPage={page}
            pageSize={pageSize}
            totalPages={totalPage}
            onPageChange={handlePageChange}
            setPageSize={handlePageSizeChange}
          />
        )}
      </div>
    </Modal>
  );
}
