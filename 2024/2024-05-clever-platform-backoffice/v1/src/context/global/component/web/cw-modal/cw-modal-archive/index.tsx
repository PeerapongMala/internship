import Modal, { ModalProps } from '../Modal';

interface ModalArchiveProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onOk?: () => void;
  is_forever?: boolean
}

const CWModalArchive = ({
  open,
  onClose,
  children,
  onOk,
  is_forever = false,
  ...rest
}: ModalArchiveProps) => {
  const title = is_forever ? "จัดเก็บถาวร" : "จัดเก็บ";
  return (
    <Modal
      className="h-auto min-h-[220px] w-[450px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={title}
      {...rest}
    >
      <div className="w-full">
        <div className="">
          {is_forever ? (
            <p>
              ข้อมูลที่เลือกจะถูก <span className="underline ">จัดเก็บถาวร</span>{' '}
              และไม่สามารถเรียกคืนได้อีก
              <p>คุณแน่ใจว่าต้องการจัดเก็บข้อมูลนี้อย่างถาวรหรือไม่?</p>
            </p>
          ) : (
            <p>
              ข้อมูลที่เลือกจะถูก <span className="underline">ปิดใช้งาน</span>{' '}
              และสำรองไว้ในฐานข้อมูล
              <p>โดยจะถูกซ่อนออกจากการเรียกใช้ ยืนยันที่จะจัดเก็บหรือไม่?</p>
            </p>
          )}
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

export default CWModalArchive;
