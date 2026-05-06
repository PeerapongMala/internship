import ModalAction from './wc-o-modal-action';

interface ModalOpenStatusProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  selectedStatusId: string | null;
}

export const ModalOpenStatus = ({
  isOpen,
  onClose,
  onAccept,
  selectedStatusId,
}: ModalOpenStatusProps) => {
  return (
    <ModalAction
      open={isOpen}
      onClose={onClose}
      title="เปิดใช้งาน"
      cancelButtonText="ยกเลิก"
      cancelButtonVariant="dark"
      acceptButtonText="เปิดใช้งาน"
      acceptButtonVariant="danger"
      onAccept={onAccept}
    >
      <div className="flex flex-col gap-4">ข้อมูลที่คุณเลือกจะถูกเปิดใช้งานอีกครั้ง</div>
    </ModalAction>
  );
};
