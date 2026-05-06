import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx';
import { ObserverData, ParentData, NormalUserData } from '../../../types';
import { ObserverAccessResponse } from '../../../../local/type';
import { USER_ROLES, USER_ROLE_LABELS } from '../../../../local/type';
import { useState, useEffect } from 'react';
import ObserverAccessSection from './observer-access-section';
import { Menu, MenuButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import showMessage from '@global/utils/showMessage';

interface EditInfoProps {
  userData: ObserverData | ParentData | NormalUserData;
  observerAccesses: ObserverAccessResponse[];
  pendingRoles: number[];
  getPageType: () => 'parent' | 'observer' | 'content-creator' | 'normal';
  handleInputChange: (field: string, value: string) => void;
  handleRoleChange: (roleId: number, checked: boolean) => void;
  selectedTab: string;
  path: string;
  handleObserverAccessChange?: (accessId: number, checked: boolean) => void;
  handleImageChange: (file: File) => void;
  onObserverAccessTabChange: (accessName: string) => void;
  pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  setPagination: (pagination: {
    page: number;
    limit: number;
    total_count: number;
  }) => void;
}

const Section = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex flex-col rounded-md bg-white p-4 shadow dark:bg-black ${className}`}
  >
    <p className="pb-4 text-lg font-bold">{title}</p>
    {children}
  </div>
);

const EditInfo = ({
  pagination,
  setPagination,
  userData,
  observerAccesses,
  pendingRoles,
  getPageType,
  handleInputChange,
  handleRoleChange,
  selectedTab,
  path,
  handleObserverAccessChange,
  handleImageChange,
  onObserverAccessTabChange,
}: EditInfoProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleFileValidation = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, JPG, PNG)', 'warning');
      return false;
    }
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showMessage('ขนาดไฟล์ใหญ่เกินไป ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
      return false;
    }

    return true;
  };
  useEffect(() => {
    // Auto check admin role when component renders for normal users
    if (
      getPageType() === 'normal' &&
      !path.includes('/content-creator/') &&
      'roles' in userData
    ) {
      if (!pendingRoles.includes(USER_ROLES.ADMIN)) {
        handleRoleChange(USER_ROLES.ADMIN, true);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getRole = () => {
    const path = window.location.pathname;
    if (path.includes('/parent/')) {
      return 'ผู้ปกครอง';
    } else if (path.includes('/observer/')) {
      return 'ผู้สังเกตการณ์';
    } else if (path.includes('/content-creator/')) {
      return 'นักวิชาการ';
    }
    return 'แอดมิน';
  };

  const isCreateMode = () => {
    return !userData.id;
  };

  return (
    <div className="col-span-3 flex flex-col gap-4">
      <Section className="" title="">
        <div className="flex flex-row gap-[54px]">
          <div className="flex flex-col items-center gap-[10px]">
            <div className="h-60 w-60 overflow-hidden rounded-full bg-gray-400">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
              ) : userData?.image_url ? (
                <img
                  src={userData.image_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-500">
                  ไม่มีรูป
                </div>
              )}
            </div>
            <label htmlFor="upload-button" className="btn btn-outline-primary">
              อัพโหลดรูป
            </label>
            <input
              id="upload-button"
              type="file"
              accept="image/jpeg, image/png, image/jpg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (!handleFileValidation(file)) {
                    return;
                  }
                  handleImageChange(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
            <div className="text-center text-sm text-neutral-400">
              <p>ขนาดแนะนำ</p>
              <p>60x60</p>
            </div>
          </div>
          <div>
            <div className="grid w-full grid-cols-3 gap-4">
              <div className="mb-2 w-full">
                <div>
                  <span className="text-red-500">*</span>
                  <span className="pb-1"> ตำแหน่ง</span>

                  <button
                    className="mb-1 mt-1 inline-flex w-full cursor-not-allowed items-center justify-between gap-x-1.5 rounded-md bg-gray-100 px-4 py-2 text-sm font-normal ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:ring-2 focus:ring-indigo-500 dark:bg-black"
                    disabled
                  >
                    {getRole()}
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 h-5 w-5 text-gray-400"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-4">
              <div className="mb-2 w-full">
                <CWInput
                  label="คำนำหน้า"
                  value={userData?.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="mb-2 w-full">
                <CWInput
                  label="ชื่อ"
                  value={userData?.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="mb-2 w-full">
                <CWInput
                  label="นามสกุล"
                  value={userData?.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-4">
              <div className="mb-2 w-full">
                <CWInput
                  label="อีเมล"
                  value={userData?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </Section>
      {userData && getPageType() === 'observer' && 'observer_accesses' in userData && (
        <ObserverAccessSection
          userData={userData as ObserverData}
          observerAccesses={observerAccesses}
          handleObserverAccessChange={handleObserverAccessChange}
          onTabChange={onObserverAccessTabChange}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
      {userData &&
        getPageType() === 'normal' &&
        !path.includes('/content-creator/') &&
        'roles' in userData && (
          <Section className="col-span-3" title="ความรับผิดชอบ">
            <div className="grid max-w-fit grid-cols-2 gap-4">
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <CWInputCheckbox
                  key={value}
                  label={USER_ROLE_LABELS[value]}
                  checked={pendingRoles.includes(value)}
                  onChange={(e) => handleRoleChange(value, e.target.checked)}
                  disabled={!isCreateMode() && value === USER_ROLES.ADMIN}
                />
              ))}
            </div>
          </Section>
        )}
    </div>
  );
};

export default EditInfo;
