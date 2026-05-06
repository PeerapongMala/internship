import Modal, { ModalProps } from '../Modal';

interface ModalArchiveProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onOk?: () => void;
}

const CWModalDelete = ({ open, onClose, children, onOk, ...rest }: ModalArchiveProps) => {
  return (
    <Modal
      className="h-auto min-h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="ลบข้อมูล"
      {...rest}
    >
      <div className="w-full">
        <div className="">
          <p>
            ข้อมูลดังกล่าวจะถูก <span className="underline">ลบ</span>{' '}
            และไม่สามารถเรียกคืนกลับมาได้
            <p>ยืนยันที่จะดำเนินการลบหรือไม่?</p>
          </p>
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

export default CWModalDelete;
