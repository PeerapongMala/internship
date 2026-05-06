import { Modal, ModalProps } from '@component/web/cw-modal';

interface ModalDelete extends ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number[]) => void;
  id: number[];
}

const CWModalDeltet = ({
  open,
  onClose,
  children,
  onConfirm,
  onOk,
  id,
  ...rest
}: ModalDelete) => {
  console.log({ idDelete: id });
  return (
    <Modal
      className="h-auto w-[450px]"
      open={open}
      onClose={onClose}
      onOk={() => onConfirm(id)}
      disableCancel
      disableOk
      title="ลบไอเทม"
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">คุณต้องการลบไอเทมนี้หรือไม่</div>

        <div className="mt-5 flex w-full justify-between gap-5 px-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button
            onClick={() => onConfirm(id)}
            className="btn btn-danger flex w-full gap-2"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalDeltet;
