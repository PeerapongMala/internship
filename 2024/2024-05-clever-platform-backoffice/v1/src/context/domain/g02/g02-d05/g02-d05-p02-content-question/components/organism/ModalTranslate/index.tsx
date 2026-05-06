import { useState, useEffect } from 'react';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCaretsDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretsDown';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { Pagination } from '@mantine/core';
import ModalNewCreate from '../ModalNewCreate';
import API from '@domain/g02/g02-d05/local/api';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import usePagination from '@global/hooks/usePagination';

export interface TranslateObject {
  id: string;
  value: string;
}

interface ModalTranslateProps extends ModalProps {
  openWithCallback?: {
    show: boolean;
    callback: (id: string, value: string) => void;
    selected?: string;
  };
  mainLanguage?: string;
  curriculumGroupId?: string | number;
}

const defaultLanguage = [
  { value: 'th', label: 'ภาษาไทย' },
  { value: 'en', label: 'ภาษาอังกฤษ' },
  { value: 'ch', label: 'ภาษาจีน' },
];

const ModalTranslate = ({
  open,
  openWithCallback,
  onClose,
  children,
  mainLanguage,
  curriculumGroupId,
  ...rest
}: ModalTranslateProps) => {
  const [showModalNewCreate, setShowModalNewCreate] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [language, setLanguage] = useState({ value: 'th', label: 'ภาษาไทย' });
  const [options, setOptions] = useState<TranslateObject[]>([]);
  const {
    page,
    pageSize: limit,
    totalCount,
    setPage,
    setPageSize: setLimit,
    setTotalCount,
  } = usePagination({ isModal: true });

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const onClickNewCreate = () => {
    setShowModalNewCreate(true);
  };

  const handleCloseModalNewCreate = () => {
    handleFetchData();
    setShowModalNewCreate(false);
  };

  const handleOk = () => {
    if (openWithCallback?.callback) {
      openWithCallback.callback(selectedId, selectedValue);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleFetchData = () => {
    const params = {
      page,
      limit,
      text: search,
      language: language.value,
    };
    setLoading(true);
    if (curriculumGroupId) {
      API.academicLevel.GetG02D05A37(String(curriculumGroupId), params).then((res) => {
        setLoading(false);
        if (res.status_code === 200) {
          const data = [];

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].group_id) {
              data.push({
                id: res.data[i].group_id,
                value: res.data[i].text,
              });
            }
          }

          setTotalCount(Number(res._pagination.total_count));
          setOptions(data);
        }
      });
    } else {
      setLoading(false);
    }
  };

  const handleChangeLanguage = (value: any) => {
    setLanguage(value);
    setPage(1);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeoutId = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    handleFetchData();
  }, [page, limit, search, language]);

  useEffect(() => {
    if (mainLanguage) {
      const find = defaultLanguage.find((item) => item.value === mainLanguage);
      setLanguage({ value: mainLanguage, label: find?.label || '' });
    }

    if (openWithCallback?.show) {
      setSearch('');
      setPage(1);
    }
  }, [mainLanguage, openWithCallback?.show]);

  useEffect(() => {
    if (openWithCallback?.selected) {
      setSelectedId(openWithCallback?.selected);
      const value = options.find((item) => item.id === openWithCallback?.selected);
      setSelectedValue(value?.value || '');
    } else {
      setSelectedId('');
      setSelectedValue('');
    }
  }, [openWithCallback?.selected, openWithCallback?.show]);

  if (!openWithCallback?.show) return null;

  return (
    <>
      <Modal
        className="w-3/4"
        open={openWithCallback.show}
        onClose={onClose}
        disableCancel
        disableOk
        title="เลือกข้อความ"
        {...rest}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-4 flex w-full items-center gap-2">
            <Select
              className="w-1/4"
              options={defaultLanguage}
              value={language}
              onChange={handleChangeLanguage}
              // defaultValue={{ value: 'th', label: 'ภาษาไทย' }}
            />
            <Input
              className="w-full"
              placeholder="คำตอบ"
              // onChange={(e) => setSearch((e.target.value))}
              onInput={(e) => {
                setPage(1);
                handleSearchInput(e as React.ChangeEvent<HTMLInputElement>);
              }}
              value={search}
            />
          </div>
          <Divider />
          <div className="h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : (
              options.map((item, index) => (
                <label key={index} className="inline-flex w-full items-center gap-2">
                  <input
                    type="radio"
                    className="form-radio !hidden"
                    name="translate"
                    onChange={() => {
                      setSelectedId(item.id);
                      setSelectedValue(item.value);
                    }}
                    checked={selectedId === item.id}
                  />
                  <div
                    className={cn(
                      'form-input grid h-10 w-full grid-cols-2 items-center p-[10px] px-4 !font-normal hover:bg-gray-200',
                      selectedId === item.id
                        ? '!border-1 !border-primary !bg-blue-100'
                        : 'border-gray-300',
                    )}
                  >
                    <div>ID: {item.id}</div>
                    <div>{item.value}</div>
                  </div>
                </label>
              ))
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex w-96 items-center gap-2">
              <div>
                แสดง {page} จาก {Math.ceil(totalCount / limit)} หน้า
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
                  setPage(1);
                  setLimit(Number(value.value));
                }}
                isSearchable={false}
              />
            </div>
            <Pagination
              value={page}
              total={Math.ceil(totalCount / limit)}
              onChange={(page) => setPage(page)}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="btn btn-outline-primary w-44" onClick={onClose}>
              ย้อนกลับ
            </button>
            <div className="flex gap-2">
              <button className="btn btn-outline-primary w-44" onClick={onClickNewCreate}>
                สร้างใหม่
              </button>
              <button className="btn btn-primary w-44" onClick={handleOk}>
                เลือก
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <ModalNewCreate
        open={showModalNewCreate}
        onClose={handleCloseModalNewCreate}
        curriculumGroupId={curriculumGroupId}
        mainLanguage={mainLanguage}
      />
    </>
  );
};

export default ModalTranslate;
