import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { TranslateTextRecord } from '@domain/g02/g02-d06/local/type';

interface ModalConfirmArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  children?: React.ReactNode;
  btnOk?: React.ReactNode;
  title?: string;
  type?: string;
  selectedRecords?: TranslateTextRecord[];
}

const ModalConfirmArchive = ({
  isOpen,
  onClose,
  onOk,
  children,
  btnOk,
  title: titleProp,
  type,
  selectedRecords,
}: ModalConfirmArchiveProps) => {
  let title = titleProp;
  let text1 = '';
  let text2 = '';
  if (type === 'archive') {
    const amountArchive = selectedRecords?.filter(
      (record) => record.status === 'enabled',
    ).length;
    const amountDelete = selectedRecords?.filter(
      (record) => record.status === 'draft',
    ).length;
    title = 'จัดเก็บข้อมูล';
    text1 = amountArchive ? `(ข้อมูลที่จะถูกจัดเก็บทั้งหมด ${amountArchive} รายการ)` : '';
    text2 = amountDelete ? `(ข้อมูลที่จะถูกลบทั้งหมด ${amountDelete} รายการ)` : '';
  } else if (type === 'enable') {
    const amountEnable = selectedRecords?.length;
    title = 'เปิดใช้งานข้อมูล';
    text1 = 'คุณต้องการเปิดใช้งานข้อมูลหรือไม่';
    text2 = amountEnable
      ? `(ข้อมูลที่จะถูกเปิดใช้งานทั้งหมด ${amountEnable} รายการ)`
      : '';
  } else if (type === 'toggle-speech') {
    const amountToggleSpeech = selectedRecords?.length;
    title = 'เปิด การสร้างเสียง';
    text1 = 'คุณต้องการเปิดการสร้างเสียงหรือไม่';
    text2 = amountToggleSpeech
      ? `(ข้อมูลที่จะถูกเปิดการสร้างเสียงทั้งหมด ${amountToggleSpeech} รายการ)`
      : '';
  } else if (type === 'toggle-speech-delete') {
    const amountToggleSpeechDelete = selectedRecords?.length;
    title = 'ลบ การสร้างเสียง';
    text1 = 'คุณต้องการลบการสร้างเสียงหรือไม่';
    text2 = amountToggleSpeechDelete
      ? `(ข้อมูลที่จะถูกลบการสร้างเสียงทั้งหมด ${amountToggleSpeechDelete} รายการ)`
      : '';
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={title || 'จัดเก็บข้อมูล'}
      onOk={onOk}
      disableCancel
      disableOk
      className="w-[26rem]"
    >
      <div className="flex h-full flex-col justify-around gap-4">
        <div className="flex flex-col">
          {children}
          {text1 && <span className="mt-1 text-sm font-bold">{text1}</span>}
          {text2 && <span className="mb-4 mt-1 text-sm font-bold">{text2}</span>}
        </div>
        <div className="flex justify-end gap-4">
          <button className="btn btn-outline-primary w-full text-lg" onClick={onClose}>
            ยกเลิก
          </button>
          {btnOk ? btnOk : getButtonOk(type, onOk as any)}
        </div>
      </div>
    </Modal>
  );
};

const getButtonOk = (type?: string, onOk?: () => void) => {
  if (type === 'enable') {
    return (
      <button className="btn btn-success w-full text-lg" onClick={onOk}>
        เปิดใช้งาน
      </button>
    );
  }

  if (type === 'toggle-speech') {
    return (
      <button className="btn btn-success w-full text-lg" onClick={onOk}>
        สร้างเสียง
      </button>
    );
  }

  if (type === 'toggle-speech-delete') {
    return (
      <button className="btn btn-danger w-full text-lg" onClick={onOk}>
        ลบการสร้างเสียง
      </button>
    );
  }

  return (
    <button className="btn btn-danger w-full text-lg" onClick={onOk}>
      จัดเก็บ
    </button>
  );
};

export default ModalConfirmArchive;
