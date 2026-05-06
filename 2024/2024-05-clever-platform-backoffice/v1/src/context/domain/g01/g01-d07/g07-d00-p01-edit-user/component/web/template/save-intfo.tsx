import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx';
import { ObserverData, ParentData, NormalUserData } from '../../../types';
import CWInput from '@component/web/cw-input';
import CWModalEdit from '@component/web/cw-modal/cw-modal-edit';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../../../local/api';
import showMessage from '@global/utils/showMessage';
import { USER_ROLES } from '../../../../local/type';

interface UserInfoSidebarProps {
  userData: ObserverData | ParentData | NormalUserData;
  statusOptions: { value: string; label: string }[];
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  onPasswordChange: (newPassword: string) => void;
  getPageType: () => string;
  pendingRoles?: number[];
}

const SaveInfo = ({
  userData,
  statusOptions,
  handleInputChange,
  handleSubmit,
  onPasswordChange,
  isSubmitting,
  getPageType,
  pendingRoles = [],
}: UserInfoSidebarProps) => {
  const [searchParams] = useSearchParams();
  const openPasswordModal = searchParams.get('openModal') !== null;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (openPasswordModal) {
      setIsOpenModal(true);
    }
  }, [openPasswordModal]);

  const handlePasswordSave = async (value: string) => {
    try {
      await API.adminUserAccount.UpdatePassword(userData.id, value);
      showMessage('อัพเดทรหัสผ่านสำเร็จ', 'success');
      setIsOpenModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
      showMessage('อัพเดทรหัสผ่านไม่สำเร็จ', 'error');
    }
  };

  const isCreateMode = () => {
    return !userData.id;
  };

  const isSaveDisabled = () => {
    // ถ้าเป็น normal user และไม่ใช่ content creator ต้องเลือกความรับผิดชอบอย่างน้อย 1 อย่าง
    if (
      getPageType() === 'normal' &&
      !window.location.pathname.includes('/content-creator/')
    ) {
      return isSubmitting || pendingRoles.length === 0;
    }
    return isSubmitting;
  };

  return (
    <div className="relative flex h-fit w-full flex-col gap-4 rounded-md bg-white p-4 shadow dark:bg-black">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <p className="w-1/3">
            <span className="text-red-500">*</span>รหัสผู้ใช้งาน
          </p>
          <p className="w-2/3">{userData?.id || '-'}</p>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <p className="w-1/3">
            <span className="text-red-500">*</span>สถานะ
          </p>
          <span className="w-2/3">
            <WCADropdown
              placeholder={
                statusOptions.find((o) => o.value === userData?.status)?.label ||
                'เลือกสถานะ'
              }
              options={statusOptions.map((o) => o.label)}
              onSelect={(label: string) => {
                const selectedValue =
                  statusOptions.find((o) => o.label === label)?.value || '';
                handleInputChange('status', selectedValue);
              }}
            />
          </span>
        </div>

        <div className="flex flex-row gap-4">
          <p className="w-1/3">แก้ไขล่าสุด</p>
          <p className="w-2/3">
            {userData?.last_login
              ? new Date(userData?.last_login).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })
              : '-'}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          <p className="w-1/3">แก้ไขโดย</p>
          <p className="w-2/3">{userData?.updated_by || '-'}</p>
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={isSaveDisabled()}
      >
        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>

      {getPageType() !== 'parent' && isCreateMode() && (
        <button
          className="btn btn-primary w-full"
          onClick={() => setIsOpenModal(true)}
          disabled={false}
        >
          กำหนดรหัสผ่าน
        </button>
      )}

      <CWModalEdit
        title="กำหนดรหัสผ่าน"
        label="รหัสผ่านใหม่"
        placeholder="กรุณากรอกรหัสผ่านใหม่"
        okButtonText="ตกลง"
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onSave={(value) => {
          if (isCreateMode()) {
            // ตอนสร้างใหม่ - เก็บค่าไว้ก่อน รอกดบันทึก
            setNewPassword(value);
            onPasswordChange(value);
            setIsOpenModal(false);
          } else {
            // ตอนแก้ไข - อัพเดทรหัสผ่านทันที
            handlePasswordSave(value);
          }
        }}
      />
    </div>
  );
};

export default SaveInfo;
