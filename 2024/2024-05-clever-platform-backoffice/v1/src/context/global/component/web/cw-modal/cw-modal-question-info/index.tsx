import { useState } from 'react';

import Modal, { ModalProps } from '../Modal';

interface CWModalQuestionInfoProps extends ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

const CWModalQuestionInfo = ({ title, open, onClose }: CWModalQuestionInfoProps) => {
  // Mock data
  const question = {
    questionType: 'คำถามปรนัยแบบเลือกตอบ ',
    question: 'จงเลือกคำตอบที่ถูกต้อง',
    options: ['ก', 'ข', 'ค'],
    answer: 'ก',
    hint: '-',
  };

  const objective = 'XXXXXXXX';
  const standard = 'XXXXXXXX';
  const indicators = 'XXXXXXXX';

  return (
    <Modal className="h-auto w-[400px]" open={open} onClose={onClose} title={title}>
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">วัตถุประสงค์การเรียนรู้</span>
          <span className="text-sm text-neutral-950">{objective}</span>

          <span className="text-sm font-bold">มาตรฐาน</span>
          <span className="text-sm text-neutral-950">{standard}</span>

          <span className="text-sm font-bold">ตัวชี้วัด</span>
          <span className="text-sm text-neutral-950">{indicators}</span>
        </div>

        <div className="my-5 border-b-2"></div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">ข้อที่ 1</span>
          <span className="text-sm font-bold">รูปแบบคำถาม</span>
          <span className="text-sm text-neutral-950">{question.questionType}</span>

          <span className="text-sm font-bold">โจทย์</span>
          <span className="text-sm text-neutral-950">{question.question}</span>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold">ตัวเลือก</span>
            {question.options.map((option, index) => (
              <span key={index} className="text-sm text-neutral-950">
                {option}
              </span>
            ))}

            <span className="text-sm font-bold">คำตอบ</span>
            <span className="text-sm text-neutral-950">{question.answer}</span>

            <span className="text-sm font-bold">Hint</span>
            <span className="text-sm text-neutral-950">{question.hint}</span>
          </div>
        </div>

        <div className="mt-6 flex w-full justify-center">
          <button onClick={onClose} className="btn btn-outline-primary flex w-fit">
            ย้อนกลับ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalQuestionInfo;
