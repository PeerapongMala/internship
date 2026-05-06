import { Modal, ModalProps } from '@component/web/cw-modal';
import { getUserData } from '@global/utils/store/getUserData';
import { useState } from 'react';
import CsvUpload from './components/CsvUpload';

interface MoveStudentModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onFileChange?: (file?: File, forceMove?: boolean) => Promise<void>;
}

const moveOptions = {
  '1': {
    title: '1. ย้ายข้ามชั้นปี',
    details:
      'รูปแบบย้ายข้ามชั้นปี ใช้ในการสร้างห้องเรียนและเพิ่มนักเรียนไปยังปีการศึกษาที่กำหนด',
    detailColor: 'text-[#1D4ED8]',
    warnings: [
      'จะไม่สามารถย้ายได้ หากนักเรียนคนใดคนหนึ่งได้มีชื่ออยู่ในห้องใดห้องหนึ่งอยู่แล้ว ในปีการศึกษาที่จะย้าย',
      'ไม่สามารถย้ายได้หากนักเรียนไม่มีชื่ออยู่ในโรงเรียนมาก่อน',
    ],
  },
  '2': {
    title: '2. ย้ายระหว่างชั้นปี',
    details:
      'รูปแบบย้ายระหว่างชั้นปี ใช้ในการย้ายนักเรียนที่มีห้องเรียนในปีการศึกษานั้นก่อนแล้ว ระบบจะทำการถอนนักเรียนออกจากห้องต้นทางอัตโนมัติ และทำการย้ายไปปลายทางในปีการศึกษาเดียวกัน',
    detailColor: 'text-red-600',
    warnings: [
      'ควรระวัง การถอนนักเรียนออกจากห้องโดยไม่ตั้งใจ เนื่องจาระบบจะทำการถอนนักเรียนออกจากห้องเดิมอัตโนมัติในปีการศึกษาเดียวกัน',
      'การถอนนักเรียนออกจากห้องเรียน ไม่ส่งผลหากย้ายห้องข้ามปีการศึกษา',
    ],
  },
};

type MoveTypeKey = keyof typeof moveOptions;

const MoveStudentModal = ({
  open,
  onClose,
  onFileChange,
  ...rest
}: MoveStudentModalProps) => {
  const { school_id: schoolID } = getUserData();
  const [moveType, setMoveType] = useState<MoveTypeKey>('1');
  const [inputValue, setInputValue] = useState('');

  const selectedOption = moveOptions[moveType];

  return (
    <Modal
      className="h-auto w-[480px] max-w-full"
      open={open}
      onClose={onClose}
      title="ย้ายนักเรียน"
      {...rest}
    >
      <div className="w-full space-y-4">
        <p className="border-b border-[#E8E8E8] pb-4 text-[14px] font-medium text-[#525252]">
          อัปโหลดไฟล์ CSV เพื่อย้ายนักเรียน
        </p>

        <div className="space-y-1">
          <label className="text-sm font-medium">รูปแบบการย้ายนักเรียน:</label>
          <select
            value={moveType}
            onChange={(e) => setMoveType(e.target.value as MoveTypeKey)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="1">{moveOptions['1'].title}</option>
            <option value="2">{moveOptions['2'].title}</option>
          </select>
        </div>

        <div className={`text-sm leading-relaxed ${selectedOption.detailColor}`}>
          รายละเอียด:
          <br />
          {selectedOption.details}
        </div>

        <div className="text-sm leading-relaxed text-[#1F2937]">
          <p className="font-bold text-black">*ข้อควรระวัง:</p>
          <ol className="list-decimal space-y-1 pl-5">
            {selectedOption.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ol>
        </div>

        <div className="flex justify-between gap-4 pt-2">
          <button onClick={onClose} className="btn btn-outline-dark w-full font-bold">
            ยกเลิก
          </button>

          <CsvUpload
            onFileChange={async (file) => {
              await onFileChange?.(file, moveType == '2');
            }}
            onSuccess={onClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MoveStudentModal;
