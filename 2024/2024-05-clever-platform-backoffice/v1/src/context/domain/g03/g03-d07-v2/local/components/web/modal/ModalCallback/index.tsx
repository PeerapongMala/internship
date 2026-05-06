import { Modal, ModalProps } from '@component/web/cw-modal';

interface ModalArchiveProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onOk: () => void;
}

const CWModalCallback = ({
  open,
  onClose,
  children,
  onOk,
  ...rest
}: ModalArchiveProps) => {
  return (
    <Modal
      className="h-auto w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เรียกคืนถาวร"
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกเรียกคืน
          คุณจะไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีกครั้ง
        </div>
      </div>
      <div className="mt-5 flex w-full justify-between gap-5">
        <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
          ยกเลิก
        </button>
        <button onClick={onOk} className="btn btn-danger flex w-full gap-2">
          เรียกคืน
        </button>
      </div>
    </Modal>
  );
};

export default CWModalCallback;
