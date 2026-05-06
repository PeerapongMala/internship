import { Modal } from '@component/web/cw-modal';
import CWButton from '@component/web/cw-button';

interface DataProps {
  open: boolean;
  onClose: () => void;
  onArchive: () => void;
}

const ArchiveModal = ({ open, onClose, onArchive }: DataProps) => {
  return (
    <Modal onClose={onClose} open={open} title={'จัดเก็บประกาศ'} className="w-[450px]">
      <div className="flex flex-col gap-3">
        <div>
          ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>
        <div className="flex gap-2 *:flex-1">
          <CWButton
            outline
            className="!border-dark !text-dark hover:!bg-dark hover:!text-white"
            title="ยกเลิก"
            onClick={onClose}
          />
          <CWButton
            title="จัดเก็บข้อมูล"
            className="!border-danger !bg-danger"
            onClick={onArchive}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ArchiveModal;
