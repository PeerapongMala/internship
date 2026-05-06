import ModalAction from '../../../../local/component/web/organism/wc-o-modal-action';
import { UserAccountResponse } from '../../../../local/type';

interface ModalCloseAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  selectedUserId: string | null;
}

export const ModalCloseAccount = ({
  isOpen,
  onClose,
  onAccept,
  selectedUserId,
}: ModalCloseAccountProps) => {
  return (
    <ModalAction
      open={isOpen}
      onClose={onClose}
      title="ปิดบัญชี"
      cancelButtonText="ยกเลิก"
      cancelButtonVariant="dark"
      acceptButtonText="จัดเก็บข้อมูลถาวร"
      acceptButtonVariant="danger"
      onAccept={onAccept}
    >
      <div className="flex flex-col gap-4">
        ข้อมูลที่คุณเลือกจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
        คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
      </div>
    </ModalAction>
  );
};
