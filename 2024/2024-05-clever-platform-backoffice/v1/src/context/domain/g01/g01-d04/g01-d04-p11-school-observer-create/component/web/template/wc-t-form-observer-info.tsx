import { Control, Controller, UseFormRegister, useForm } from 'react-hook-form';
import { IObserverInput } from '@domain/g01/g01-d04/local/type';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import AvatarUpload from '@domain/g01/g01-d04/local/component/web/organism/wc-o-avatar-upload';
import { useState, useEffect } from 'react';
import { ObserverAccessResponse } from '@context/domain/g01/g01-d07/local/type';
import API from '@context/domain/g01/g01-d07/local/api';
import ObserverAccessSection from '@domain/g01/g01-d07/g07-d00-p01-edit-user/component/web/template/observer-access-section';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

interface FormObserverInfoProps {
  register: UseFormRegister<Partial<IObserverInput>>;
  control: Control<Partial<IObserverInput>, any>;
  errors?: any;
}

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const FormObserverInfo: React.FC<FormObserverInfoProps> = ({
  register,
  control,
  errors,
}) => {
  const { pagination, setPagination } = usePagination();

  const [observerAccessesAll, setObserverAccessesAll] = useState<
    ObserverAccessResponse[]
  >([]);
  const [selectedAccesses, setSelectedAccesses] = useState<
    IObserverInput['observer_accesses']
  >([]);

  const fetchObserverAccesses = async (accessName?: string) => {
    try {
      const response = await API.observersAccount.GetObserverAccesses(
        accessName
          ? { access_name: accessName, page: pagination.page, limit: pagination.limit }
          : { page: pagination.page, limit: pagination.limit },
      );
      if ('data' in response) {
        setObserverAccessesAll(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
    } catch (error) {
      console.error('Error fetching observer accesses:', error);
    }
  };

  useEffect(() => {
    fetchObserverAccesses();
  }, [pagination.page, pagination.limit]);

  const handleObserverAccessChange = (accessId: number, checked: boolean) => {
    let newAccesses;
    if (checked) {
      // Add the access if it doesn't exist
      if (!selectedAccesses.some((access) => access.observer_access_id === accessId)) {
        const newAccess = {
          observer_access_id: accessId,
          access_name:
            observerAccessesAll.find((access) => access.id === accessId)?.name || '',
        };
        newAccesses = [...selectedAccesses, newAccess];
      }
    } else {
      // Remove the access if it exists
      newAccesses = selectedAccesses.filter(
        (access) => access.observer_access_id !== accessId,
      );
    }
    if (newAccesses) {
      setSelectedAccesses(newAccesses);
    }
  };

  return (
    <>
      <div className="panel h-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-3">
            <p className="text-lg font-bold">ข้อมูลทั่วไป</p>
            <Controller
              name="profile_image_file"
              control={control}
              render={({ field: { onChange, value } }) => (
                <AvatarUpload
                  src={value instanceof File ? URL.createObjectURL(value) : ''}
                  onFileChange={(file) => {
                    if (file) {
                      if (!file.type.startsWith('image/')) {
                        showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        showMessage('ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
                        return;
                      }
                      onChange(file);
                    }
                  }}
                />
              )}
            />
          </div>

          <div className="col-span-2 mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <CWSelect
                label="ตำแหน่ง"
                required
                disabled
                className="w-full"
                value={'ผู้สังเกตการณ์'}
                options={[{ label: 'ผู้สังเกตการณ์', value: 'ผู้สังเกตการณ์' }]}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'กรุณาระบุคำนำหน้า' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <CWInput
                        {...field}
                        title="คำนำหน้า"
                        label="คำนำหน้า"
                        placeholder="กรุณาระบุ คำนำหน้า"
                        required
                        className="w-full"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {error && (
                        <span className="text-sm text-red-500">{error.message}</span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: 'กรุณาระบุชื่อ' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <CWInput
                        {...field}
                        title="ชื่อ"
                        label="ชื่อ"
                        placeholder="กรุณาระบุ ชื่อจริง"
                        required
                        className="w-full"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {error && (
                        <span className="text-sm text-red-500">{error.message}</span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-span-1">
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: 'กรุณาระบุนามสกุล' }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <CWInput
                        {...field}
                        title="นามสกุล"
                        label="นามสกุล"
                        placeholder="กรุณาระบุ นามสกุล"
                        required
                        className="w-full"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {error && (
                        <span className="text-sm text-red-500">{error.message}</span>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'กรุณาระบุอีเมล',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'กรุณาระบุอีเมลให้ถูกต้อง',
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <CWInput
                      {...field}
                      title="อีเมล"
                      label="อีเมล"
                      placeholder="กรุณาระบุ อีเมล"
                      required
                      className="w-full"
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {error && (
                      <span className="text-sm text-red-500">{error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <Controller
        name="observer_accesses"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <ObserverAccessSection
            observerAccesses={observerAccessesAll}
            userData={{
              id: '',
              title: '',
              first_name: '',
              last_name: '',
              id_number: null,
              image_url: null,
              status: 'enabled',
              email: '',
              created_at: null,
              created_by: null,
              updated_at: null,
              updated_by: null,
              last_login: null,
              observer_accesses: selectedAccesses.map((access) => ({
                observer_access_id: access.observer_access_id,
                access_name: access.access_name,
                name: access.access_name,
                updated_at: '',
                updated_by: '',
              })),
            }}
            onTabChange={(accessName) => fetchObserverAccesses(accessName)}
            pagination={pagination}
            setPagination={setPagination}
            handleObserverAccessChange={(accessId, checked) => {
              handleObserverAccessChange(accessId, checked);
              if (checked) {
                const newAccess = {
                  observer_access_id: accessId,
                  access_name:
                    observerAccessesAll.find((access) => access.id === accessId)?.name ||
                    '',
                };
                field.onChange([...selectedAccesses, newAccess]);
              } else {
                field.onChange(
                  selectedAccesses.filter(
                    (access) => access.observer_access_id !== accessId,
                  ),
                );
              }
            }}
          />
        )}
      />
    </>
  );
};

export default FormObserverInfo;
