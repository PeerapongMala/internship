import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { useEffect } from 'react';

interface ModalConfirmArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  amountArchive?: number;
  amountDelete?: number;
  passwordDelete: string;
  setPasswordDelete: (password: string) => void;
  selectedRecord?: any;
  loading?: boolean;
}

const ModalConfirmArchive = ({
  isOpen,
  onClose,
  onOk,
  amountArchive = 0,
  amountDelete = 0,
  passwordDelete,
  setPasswordDelete,
  selectedRecord,
  loading,
}: ModalConfirmArchiveProps) => {
  useEffect(() => {
    if (isOpen) {
      setPasswordDelete('');
    }
  }, [isOpen, setPasswordDelete]);

  const handleClose = () => {
    setPasswordDelete('');
    onClose();
  };

  const handleOk = () => {
    onOk();
    setPasswordDelete('');
  };

  return (
    <CWModalCustom
      open={isOpen}
      onClose={onClose}
      title="จัดเก็บข้อมูล หรือ ลบแบบร่าง"
      onOk={onOk}
      disableCancel
      disableOk
      className="w-[26rem]"
      loading={loading}
    >
      <div className="flex h-full flex-col justify-around gap-4">
        <div className="flex flex-col">
          {renderIsArchive({ amountArchive, amountDelete })}
          <Input
            type="password"
            className="w-full"
            placeholder="กรอกรหัสผ่าน"
            onInput={(e) => setPasswordDelete(e.target.value)}
            value={passwordDelete}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline-primary w-full text-lg" onClick={onClose}>
            ยกเลิก
          </button>
          {renderButton({
            onOk,
            status: selectedRecord?.status,
            disabled: passwordDelete.length == 0,
          })}
        </div>
      </div>
    </CWModalCustom>
  );
};

const renderIsArchive = ({
  amountArchive,
  amountDelete,
}: {
  amountArchive: number;
  amountDelete: number;
}) => {
  return (
    <>
      <span>ด่านที่ถูกเผยแพร่แล้วข้อมูลจะถูกซ่อนจากหน้านี้ถาวร</span>
      <span>และจัดเก็บในฐานข้อมูลเพื่อแสดงสถิติเท่านั้น</span>
      <span>ส่วนด่านที่เป็นแบบร่างจะถูกลบถาวร</span>
      <span className="my-4">
        คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
      </span>
      {amountArchive > 0 && (
        <span className="mt-1 text-sm font-bold">
          (ข้อมูลที่จะถูกจัดเก็บทั้งหมด {amountArchive} รายการ)
        </span>
      )}
      {amountDelete > 0 && (
        <span className="mb-4 mt-1 text-sm font-bold">
          (ข้อมูลที่จะถูกลบทั้งหมด {amountDelete} รายการ)
        </span>
      )}
    </>
  );
};

const renderButton = ({
  onOk,
  status,
  disabled,
}: {
  onOk: () => void;
  status: string;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className={cn('btn btn-danger w-full text-lg')}
      onClick={onOk}
    >
      {status === 'enabled' ? 'จัดเก็บ' : 'ลบแบบร่าง'}
    </button>
  );
};

export default ModalConfirmArchive;
