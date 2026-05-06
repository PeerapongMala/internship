import CWInput from '@component/web/cw-input';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  passwordDelete: string;
  setPasswordDelete: (password: string) => void;
}

const ModalConfirmDelete = ({
  isOpen,
  onClose,
  onOk,
  setPasswordDelete,
  passwordDelete,
}: ModalConfirmDeleteProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="คุณยืนยันที่จะลบใช่หรือไม่ ?"
      // onOk={onOk}
      disableCancel
      disableOk
      className="h-auto w-[26rem]"
    >
      <div className="flex h-full flex-col gap-5">
        <CWInput
          type="password"
          className="w-full"
          placeholder="กรอกรหัสผ่าน"
          onChange={(e) => setPasswordDelete(e.target.value)}
          value={passwordDelete}
        />
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline-dark w-full text-lg" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            className="btn btn-danger w-full text-lg"
            onClick={onOk}
            disabled={passwordDelete === ''}
          >
            ลบ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmDelete;
