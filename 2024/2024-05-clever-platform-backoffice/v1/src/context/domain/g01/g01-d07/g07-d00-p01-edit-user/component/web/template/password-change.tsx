import React, { useState } from 'react';
import CWInput from '@component/web/cw-input';
import CWModalEdit from '@component/web/cw-modal/cw-modal-edit';
import { ObserverData, ParentData, NormalUserData } from '../../../types';

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

interface PasswordChangeProps {
  userData: ObserverData | ParentData | NormalUserData;
  onPasswordChange: (newPassword: string) => void;
}

const PasswordChange = ({ userData, onPasswordChange }: PasswordChangeProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  return (
    <Section className="col-span-3 flex flex-col gap-4" title="ข้อมูลบัญชี">
      <div>
        <div className="w-1/2">
          <CWInput label="อีเมล" value={userData.email} disabled required />
        </div>
        <div className="flex w-full flex-col gap-6">
          <p className="mt-6 text-lg font-bold">รหัสผ่านใหม่</p>
          <p>
            หมายเหตุ: หากไม่ต้องการเปลี่ยนรหัสผ่านให้ปล่อยค่าว่าง
            รวมทั้งกรณีอัพเดตผ่านไฟล์ CSV
          </p>
          <CWInput placeholder="รหัสผ่านใหม่" disabled value={newPassword} />
          <button
            className="btn btn-primary w-fit"
            onClick={() => setIsOpenModal(true)}
            disabled={false}
          >
            เปลี่ยนรหัสผ่าน
          </button>

          <CWModalEdit
            title="เปลี่ยนรหัสผ่าน"
            label="รหัสผ่านใหม่"
            placeholder="กรุณากรอกรหัสผ่านใหม่"
            okButtonText="ตกลง"
            open={isOpenModal}
            onClose={() => setIsOpenModal(false)}
            onSave={(value) => {
              setNewPassword(value);
              onPasswordChange(value);
              setIsOpenModal(false);
            }}
          />
        </div>
      </div>
    </Section>
  );
};

export default PasswordChange;
