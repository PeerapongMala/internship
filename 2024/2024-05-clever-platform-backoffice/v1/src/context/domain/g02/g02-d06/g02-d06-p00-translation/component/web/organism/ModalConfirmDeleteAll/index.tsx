import {
  TranslateTextRecord,
  TranslateTextStatusType,
} from '@domain/g02/g02-d06/local/type';
import ModalConfirmArchive from '../../molecule/ModalConfirmDelete';
import { convertIdToThreeDigit } from '@domain/g02/g02-d06/local/util';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

const ModalConfirmDeleteAll = ({
  isModalConfirmArchiveOpen,
  setIsModalConfirmArchiveOpen,
  isModalConfirmBulkUpdateOpen,
  setIsModalConfirmBulkUpdateOpen,
  isModalConfirmUnarchiveOpen,
  setIsModalConfirmUnarchiveOpen,
  isModalConfirmToggleSpeechOpen,
  setIsModalConfirmToggleSpeechOpen,
  submitArchive,
  submitBulkEdit,
  submitUnarchive,
  submitToggleSpeech,
  selectedRecords,
  selectedRecordId,
  records,
}: {
  isModalConfirmArchiveOpen: boolean;
  setIsModalConfirmArchiveOpen: (value: boolean) => void;
  isModalConfirmBulkUpdateOpen: { show: boolean; type: string };
  setIsModalConfirmBulkUpdateOpen: React.Dispatch<
    React.SetStateAction<{ show: boolean; type: string }>
  >;
  isModalConfirmUnarchiveOpen: boolean;
  setIsModalConfirmUnarchiveOpen: (value: boolean) => void;
  isModalConfirmToggleSpeechOpen: boolean;
  setIsModalConfirmToggleSpeechOpen: (value: boolean) => void;
  submitArchive: () => void;
  submitBulkEdit: (
    type: 'archive' | 'toggle-speech' | 'toggle-speech-delete' | 'enable',
  ) => void;
  submitUnarchive: () => void;
  submitToggleSpeech: () => void;
  selectedRecords: TranslateTextRecord[];
  selectedRecordId?: number | null;
  records: TranslateTextRecord[];
}) => {
  const foundRecord = records.find((record) => record.id === selectedRecordId);
  return (
    <>
      <ModalConfirmArchive
        isOpen={isModalConfirmArchiveOpen}
        onClose={() => setIsModalConfirmArchiveOpen(false)}
        onOk={submitArchive}
      >
        <span>คุณต้องการจัดเก็บข้อมูลหรือไม่</span>
        <span className="font-bold">
          รหัสข้อความ : {convertIdToThreeDigit(selectedRecordId)}
        </span>
      </ModalConfirmArchive>
      <ModalConfirmArchive
        isOpen={isModalConfirmBulkUpdateOpen.show}
        onClose={() => setIsModalConfirmBulkUpdateOpen({ show: false, type: '' })}
        onOk={() => submitBulkEdit(isModalConfirmBulkUpdateOpen.type as any)}
        selectedRecords={selectedRecords}
        type={isModalConfirmBulkUpdateOpen.type}
      />
      <ModalConfirmArchive
        isOpen={isModalConfirmUnarchiveOpen}
        onClose={() => setIsModalConfirmUnarchiveOpen(false)}
        btnOk={
          <button
            onClick={submitUnarchive}
            type="button"
            className="btn btn-success w-full text-lg"
          >
            เปิดใช้งาน
          </button>
        }
        title="เปิดใช้งานข้อความ"
      >
        <span>คุณต้องการเปิดใช้งานข้อมูลหรือไม่</span>
        <span className="font-bold">
          รหัสข้อความ : {convertIdToThreeDigit(selectedRecordId)}
        </span>
      </ModalConfirmArchive>
      <Modal
        open={isModalConfirmToggleSpeechOpen}
        onClose={() => setIsModalConfirmToggleSpeechOpen(false)}
        title={foundRecord?.speech_url ? 'ลบเสียง' : 'สร้างเสียง'}
        disableCancel
        disableOk
        className="w-[26rem]"
      >
        <div className="flex h-full flex-col justify-around gap-4">
          <span>
            {foundRecord?.speech_url
              ? 'คุณต้องการลบเสียงหรือไม่'
              : 'คุณต้องการสร้างเสียงหรือไม่'}
          </span>
          <span className="font-bold">
            รหัสข้อความ : {convertIdToThreeDigit(foundRecord?.id)}
          </span>
          <div className="flex justify-end gap-4">
            <button
              className="btn btn-outline-primary w-full text-lg"
              onClick={() => setIsModalConfirmToggleSpeechOpen(false)}
            >
              ยกเลิก
            </button>
            <button
              className={cn(
                `btn w-full text-lg`,
                foundRecord?.speech_url ? 'btn-danger' : 'btn-primary',
              )}
              onClick={submitToggleSpeech}
            >
              {foundRecord?.speech_url ? 'ตกลง' : 'สร้าง'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalConfirmDeleteAll;
