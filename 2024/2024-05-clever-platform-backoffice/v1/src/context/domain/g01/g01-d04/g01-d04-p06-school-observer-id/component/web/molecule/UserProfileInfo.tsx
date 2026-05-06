import { useState, useEffect } from 'react';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import AvatarUpload from '@domain/g01/g01-d04/local/component/web/organism/wc-o-avatar-upload';
import { IObserverAccess, IObserverInput } from '@domain/g01/g01-d04/local/type';
import ObserverAccessSection from '@domain/g01/g01-d07/g07-d00-p01-edit-user/component/web/template/observer-access-section';
import API from '@context/domain/g01/g01-d07/local/api';
import { ObserverAccessResponse } from '@context/domain/g01/g01-d07/local/type';
import usePagination from '@global/hooks/usePagination';

export interface UserProfileInfoProps {
  inputValueObserver: IObserverInput;
  setInputValueObserver: React.Dispatch<React.SetStateAction<IObserverInput>>;
  observerAccesses?: IObserverAccess[];
}

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({
  inputValueObserver,
  setInputValueObserver,
  observerAccesses,
}) => {
  const handleFileChange = (file?: File) => {
    if (file) {
      setInputValueObserver({
        ...inputValueObserver,
        profile_image_file: file,
        profile_path: URL.createObjectURL(file),
      });
    }
  };

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [observerAccessesAll, setObserverAccessesAll] = useState<
    ObserverAccessResponse[]
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
    console.log('accessId', accessId);
    console.log('checked', checked);
    const currentAccesses = [...inputValueObserver.observer_accesses];

    if (checked) {
      // Add the access if it doesn't exist
      if (!currentAccesses.some((access) => access.observer_access_id === accessId)) {
        currentAccesses.push({
          observer_access_id: accessId,
          access_name:
            observerAccessesAll.find((access) => access.id === accessId)?.name || '',
        });
      }
    } else {
      // Remove the access if it exists
      const index = currentAccesses.findIndex(
        (access) => access.observer_access_id === accessId,
      );
      if (index !== -1) {
        currentAccesses.splice(index, 1);
      }
    }

    setInputValueObserver({
      ...inputValueObserver,
      observer_accesses: currentAccesses,
    });
  };

  return (
    <>
      <div className="panel h-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-3">
            {/* General Information Section */}
            <p className="text-lg font-bold">ข้อมูลทั่วไป</p>
            <AvatarUpload
              src={inputValueObserver.profile_path}
              onFileChange={handleFileChange}
            />
          </div>

          {/* Form Section */}
          <div className="col-span-2 mt-6 flex flex-col gap-4">
            {/* Observer Access Select */}
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
              {/* Title Select */}
              <div className="col-span-1">
                <CWInput
                  value={inputValueObserver.title}
                  onChange={(e) => {
                    setInputValueObserver({
                      ...inputValueObserver,
                      title: e.target.value,
                    });
                  }}
                  title="คำนำหน้า"
                  label="คำนำหน้า"
                  placeholder="กรุณาระบุ คำนำหน้า"
                  required
                  className="w-full"
                />
              </div>

              {/* First Name Input */}
              <div className="col-span-1">
                <CWInput
                  value={inputValueObserver.first_name}
                  onChange={(e) =>
                    setInputValueObserver({
                      ...inputValueObserver,
                      first_name: e.target.value,
                    })
                  }
                  title="ชื่อ"
                  label="ชื่อ"
                  placeholder="กรุณาระบุ ชื่อจริง"
                  required
                  className="w-full"
                />
              </div>

              {/* Last Name Input */}
              <div className="col-span-1">
                <CWInput
                  value={inputValueObserver.last_name}
                  onChange={(e) =>
                    setInputValueObserver({
                      ...inputValueObserver,
                      last_name: e.target.value,
                    })
                  }
                  title="นามสกุล"
                  label="นามสกุล"
                  placeholder="กรุณาระบุ นามสกุล"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="grid grid-cols-3 gap-4">
              <CWInput
                value={inputValueObserver.email}
                onChange={(e) =>
                  setInputValueObserver({
                    ...inputValueObserver,
                    email: e.target.value,
                  })
                }
                title="อีเมล"
                label="อีเมล"
                placeholder="กรุณาระบุ อีเมล"
                required
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Responsibility Section */}
      (
      <ObserverAccessSection
        observerAccesses={observerAccessesAll}
        userData={{
          ...inputValueObserver,
          id_number: null,
          image_url: inputValueObserver.profile_path,
          created_at: null,
          created_by: null,
          updated_at: null,
          updated_by: null,
          last_login: null,
          status: 'enabled' as const,
          observer_accesses: inputValueObserver.observer_accesses.map((access) => ({
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
        handleObserverAccessChange={handleObserverAccessChange}
      />
    </>
  );
};

export default UserProfileInfo;
