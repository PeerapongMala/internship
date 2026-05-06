import { Modal, ModalProps } from '@component/web/cw-modal';

interface ModalEnableProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const CWModalEnable = ({ open, onClose, children, onOk, ...rest }: ModalEnableProps) => {
  return (
    <Modal
      className="h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เปิดใช้งาน"
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกกลับมาใช้งานอีกครั้ง
          คุณต้องการเปิดใช้งานข้อมูลที่คุณเลือกเอาไว้อีกครั้งหรือไม่
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button onClick={onOk} className="btn btn-danger flex w-full gap-2">
            เปิดใช้งาน
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalEnable;
