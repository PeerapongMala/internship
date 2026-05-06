import Modal, { ModalProps } from '../Modal';

interface ModalArchiveProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onOk?: () => void;
}

const CWModalArchiveRecall = ({
  open,
  onClose,
  children,
  onOk,
  ...rest
}: ModalArchiveProps) => {
  return (
    <Modal
      className="h-auto min-h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เรียกคืน"
      {...rest}
    >
      <div className="w-full">
        <div className="">
          <p>
            {' '}
            ข้อมูลที่ถูกเลือกจะถูก <span className="underline">เปิดใช้งาน</span> อีกครั้ง
          </p>
          <p> ยืนยันที่จะเปิดใช้งานหรือไม่?</p>
        </div>
      </div>
      <div className="mt-8 flex w-full justify-between gap-5">
        <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
          ยกเลิก
        </button>
        <button onClick={onOk} className="btn btn-danger flex w-full gap-2">
          ยืนยัน
        </button>
      </div>
    </Modal>
  );
};

export default CWModalArchiveRecall;
