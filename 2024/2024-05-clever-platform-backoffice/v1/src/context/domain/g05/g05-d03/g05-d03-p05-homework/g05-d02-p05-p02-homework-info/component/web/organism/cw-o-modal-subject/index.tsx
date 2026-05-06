import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';

type ModalSubjectProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalSubject = ({ onClose, isOpen }: ModalSubjectProps) => {
  return (
    <CWModalCustom title="คำถาม" open={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-2">
        <span className="font-bold">สาระการเรียนรู้</span>
        <p>เข้าใจความหลากหลายของการแสดงจำนวน</p>
        <span className="font-bold">มาตรฐาน</span>
        <p>จำนวนนับที่มากกว่า 100,000</p>
        <span className="font-bold">ตัวชี้วัด</span>
        <p>อ่านและเขียนตัวเลข</p>
        <span className="font-bold">ประเภทคำถาม</span>
        <p>ปรนัยแบบเลือกตอบ</p>
        <div className="border-b-2 bg-white-dark"></div>
        <CWMAccordion title={'ข้อที่ 1'} time={'8 วินาที'} isCorrect={'ผิด'}>
          <div className="flex flex-col space-y-2">
            <span className="font-bold">จงเลือกคำตอบที่ถูกต้อง</span>
            <span className="font-bold">คำตอบที่ถูกต้อง</span>
            <p>ก</p>
            <span className="font-bold">คำตอบของนักเรียน</span>
            <p>ข</p>
          </div>
        </CWMAccordion>
        <CWMAccordion title={'ข้อที่ 2'} time={'8 วินาที'} isCorrect={'ถูก'}>
          <div className="flex flex-col space-y-2">
            <span className="font-bold">จงเลือกคำตอบที่ถูกต้อง</span>
            <span className="font-bold">คำตอบที่ถูกต้อง</span>
            <p>ก</p>
            <span className="font-bold">คำตอบของนักเรียน</span>
            <p>ก</p>
          </div>
        </CWMAccordion>
        <CWMAccordion title={'ข้อที่ 3'} time={'8 วินาที'} isCorrect={'ผิด'}>
          <div className="flex flex-col space-y-2">
            <span className="font-bold">จงเลือกคำตอบที่ถูกต้อง</span>
            <span className="font-bold">คำตอบที่ถูกต้อง</span>
            <p>ก</p>
            <span className="font-bold">คำตอบของนักเรียน</span>
            <p>ข</p>
          </div>
        </CWMAccordion>
      </div>
    </CWModalCustom>
  );
};

export default ModalSubject;
