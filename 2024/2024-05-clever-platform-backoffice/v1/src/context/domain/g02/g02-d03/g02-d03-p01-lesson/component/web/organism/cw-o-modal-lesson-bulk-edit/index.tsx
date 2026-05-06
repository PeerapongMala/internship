import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import { useState } from 'react';
import { Input } from '@core/design-system/library/vristo/source/components/Input';

interface ModalConfirmLessonBulkEditProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: (password: string) => void;
  selectedRecord: number;
}

const ModalConfirmLessonBulkEdit = ({
  isOpen,
  onClose,
  onOk,
  selectedRecord,
}: ModalConfirmLessonBulkEditProps) => {
  const [password, setPassword] = useState('');

  return (
    <CWModalCustom
      open={isOpen}
      onClose={() => {
        onClose();
        setPassword('');
      }}
      title="เปิดการใช้งานด่านทั้งหมด"
      onOk={() => {
        onOk(password);
        setPassword('');
      }}
      buttonName="ยืนยัน"
      cancelButtonName="ยกเลิก"
      className="w-[26rem]"
      disableOk={!password.trim()}
    >
      <div className="flex h-full flex-col justify-around gap-4">
        <div className="text-14 leading-tight">
          <p className="font-bold">*ข้อควรระวัง:</p>
          <p className="inline">
            เมื่อใส่รหัสผ่านและกดยืนยัน
            ระบบจะเปิดด่านทั้งหมดภายในบทเรียนย่อยทั้งหมดของบทเรียนหลัก
          </p>
        </div>

        <p className="text-12 font-bold">
          (บทเรียนหลักที่จะถูกเปิดใช้งานด่านทั้งหมด {selectedRecord} รายการ)
        </p>

        <div className="flex flex-col">
          <Input
            type="password"
            className="w-full"
            placeholder="กรอกรหัสผ่าน"
            onInput={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
      </div>
    </CWModalCustom>
  );
};

export default ModalConfirmLessonBulkEdit;
