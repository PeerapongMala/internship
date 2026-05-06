import ModalAction from '../../../../local/component/web/organism/wc-o-modal-action';
import { UserAccountResponse } from '../../../../local/type';

interface ModalCloseAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (id: string) => Promise<void>;
  selectedUserId: string | null;
}

export const ModalOpenAccount = ({
  isOpen,
  onClose,
  onAccept,
  selectedUserId,
}: ModalCloseAccountProps) => {
  return (
    <ModalAction
      open={isOpen}
      onClose={onClose}
      title="เปิดบัญชี"
      cancelButtonText="ยกเลิก"
      cancelButtonVariant="dark"
      acceptButtonText="เปิดบัญชี"
      acceptButtonVariant="danger"
      onAccept={() => selectedUserId && onAccept(selectedUserId)}
    >
      <div className="flex flex-col gap-4">
        ข้อมูลที่คุณเลือกจะถูกเปิดใช้งานอีกครั้ง คุณยืนยันที่จะเปิดหรือไม่
      </div>
    </ModalAction>
  );
};
