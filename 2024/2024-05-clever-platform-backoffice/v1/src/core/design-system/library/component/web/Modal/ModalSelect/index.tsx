import { useState, useEffect } from 'react';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination } from '@mantine/core';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWMSelect from '@component/web/molecule/cw-m-select';

export interface OptionProps {
  title?: string;
  label?: string;
  value: string;
}

export interface PaginationProps {
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface ModalSelectProps extends Omit<ModalProps, 'onOk'> {
  loading?: boolean;
  pagination?: PaginationProps;
  value?: OptionProps['value'];
  options?: OptionProps[];
  onOk?: (value: string) => void;
  onSearch?: (value: string) => void;
}

const ModalSelect = ({
  open,
  onClose,
  children,
  title,
  loading,
  pagination,
  value,
  options,
  onOk,
  onSearch,
  ...rest
}: ModalSelectProps) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [optionsFiltered, setOptionsFiltered] = useState<OptionProps[]>([]);
  const [defaultPagination, setDefaultPagination] = useState<PaginationProps>({
    page: 1,
    limit: 10,
    totalCount: 0,
    onPageChange: (page) => setDefaultPagination({ ...defaultPagination, page }),
    onLimitChange: (limit) => setDefaultPagination({ ...defaultPagination, limit }),
  });

  // const currentPagination = pagination || defaultPagination;
  const currentPagination = defaultPagination;

  const handleOk = () => {
    if (onOk) {
      onOk(selectedValue);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchValue);
      } else {
        setOptionsFiltered(
          options?.filter(
            (option) =>
              option.title?.toLowerCase().includes(searchValue) ||
              option.label?.toLowerCase().includes(searchValue),
          ) || [],
        );
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleLimitChange = (limit: number) => {
    if (currentPagination) {
      currentPagination.onLimitChange(limit);
      currentPagination.onPageChange(1);
      setDefaultPagination((prev) => ({
        ...prev,
        limit,
        page: 1,
        totalCount: optionsFiltered.length,
      }));
    }
  };

  const handlePageChange = (page: number) => {
    if (currentPagination) {
      currentPagination.onPageChange(page);
      setDefaultPagination((prev) => ({
        ...prev,
        page,
        limit: prev?.limit === 10 ? 10 : prev?.limit, // Ensure limit remains 10 if previously set
        totalCount: optionsFiltered.length,
      }));
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedValue(value || '');
    }
  }, [open, value]);

  useEffect(() => {
    if (options) {
      setOptionsFiltered(options);
      if (!pagination) {
        setDefaultPagination({
          ...defaultPagination,
          totalCount: options.length,
        });
      }
    }
  }, [options]);

  // useEffect(() => {
  //   handleFetchData();
  // }, [page, limit, search, language]);

  // useEffect(() => {
  //   if (open) {
  //     setSearch('');
  //     setPage(1);
  //   }
  // }, [open]);

  if (!open) return null;

  return (
    <>
      <Modal
        className="w-3/4"
        open={open}
        onClose={onClose}
        disableCancel
        disableOk
        title={title}
        {...rest}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-4 flex w-full items-center gap-2">
            <Input className="w-full" placeholder="ค้นหา" onInput={handleSearchInput} />
          </div>
          <Divider />
          <div className="h-[400px] overflow-y-auto">
            {loading || !optionsFiltered ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : (
              optionsFiltered.map((item, index) => (
                <label key={index} className="inline-flex w-full items-center gap-2">
                  <input
                    type="radio"
                    className="form-radio !hidden"
                    name="translate"
                    onChange={() => {
                      setSelectedValue(item.value);
                    }}
                    checked={value === item.value}
                  />
                  <div
                    className={cn(
                      'form-input grid h-10 w-full grid-cols-2 items-center p-[10px] px-4 !font-normal hover:bg-gray-200',
                      selectedValue === item.value
                        ? '!border-1 !border-primary !bg-blue-100'
                        : 'border-gray-300',
                    )}
                  >
                    <div>{item.title}</div>
                    <div>{item.label}</div>
                  </div>
                </label>
              ))
            )}
          </div>
          {/* {currentPagination && ( */}
          {false && (
            <div className="flex justify-between">
              <div className="flex w-96 items-center gap-2">
                <div>
                  แสดง {currentPagination.page} จาก{' '}
                  {Math.ceil(currentPagination.totalCount / currentPagination.limit)} หน้า
                </div>
                <CWMSelect
                  menuPosition="fixed"
                  className="z-10 w-28"
                  options={[
                    { value: '2', label: '2' },
                    { value: '20', label: '20' },
                    { value: '50', label: '50' },
                  ]}
                  defaultValue={{ value: '2', label: '2' }}
                  onChange={(value) => {
                    handleLimitChange(Number(value.value));
                  }}
                  isSearchable={false}
                />
              </div>
              <Pagination
                value={currentPagination.page}
                total={Math.ceil(currentPagination.totalCount / currentPagination.limit)}
                onChange={(page) => {
                  handlePageChange(page);
                }}
              />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <button className="btn btn-outline-primary w-44" onClick={onClose}>
              ย้อนกลับ
            </button>
            <div className="flex gap-2">
              <button className="btn btn-primary w-44" onClick={handleOk}>
                เลือก
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalSelect;
