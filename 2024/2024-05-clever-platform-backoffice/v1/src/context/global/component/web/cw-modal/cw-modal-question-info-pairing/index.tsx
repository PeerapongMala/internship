import { useState } from 'react';

import Modal, { ModalProps } from '../Modal';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown.tsx';

interface CWModalQuestionInfoPairingProps extends ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

const CWModalQuestionInfoPairing = ({
  title,
  open,
  onClose,
}: CWModalQuestionInfoPairingProps) => {
  // Mock data for multiple questions
  const questions = [
    {
      id: 1,
      question: 'จงเรียงลำดับกล่องคำตอบให้ถูกต้อง',
      duration_seconds: 8,
      correct_answer: ['A', 'B', 'C'],
      answer: ['D', 'B'],
    },
    {
      id: 2,
      question: 'จงเรียงลำดับกล่องคำตอบให้ถูกต้อง',
      duration_seconds: 8,
      correct_answer: ['D'],
      answer: ['A', 'C'],
    },
  ];

  const objective = 'XXXXXXXX';
  const standard = 'XXXXXXXX';
  const indicators = 'XXXXXXXX';

  // State to handle open/close for each question
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setOpenQuestion((prev) => (prev === id ? null : id));
  };

  return (
    <Modal className="h-auto w-[400px]" open={open} onClose={onClose} title={title}>
      <div className="w-full">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">วัตถุประสงค์การเรียนรู้</span>
          <span className="text-sm text-neutral-900">{objective}</span>

          <span className="text-sm font-bold">มาตรฐาน</span>
          <span className="text-sm text-neutral-900">{standard}</span>

          <span className="text-sm font-bold">ตัวชี้วัด</span>
          <span className="text-sm text-neutral-900">{indicators}</span>
        </div>

        <div className="my-5 border-b-2"></div>

        {/* Questions list */}
        <div className="flex flex-col gap-4">
          {questions.map((question) => (
            <div key={question.id} className="flex flex-col gap-2">
              <div
                onClick={() => toggleQuestion(question.id)}
                className="grid w-full cursor-pointer grid-cols-3 justify-between bg-neutral-100 p-2.5"
              >
                <div className="flex gap-2.5">
                  <IconCaretDown />
                  <span className="text-sm font-bold">ข้อที่ {question.id}</span>
                </div>
                <span className="text-center text-sm text-neutral-900">
                  {question.duration_seconds} วินาที
                </span>
                <span className="text-right text-sm text-neutral-900">
                  {question.correct_answer.every((a, i) => a == question.answer[i])
                    ? 'ถูก'
                    : 'ผิด'}
                </span>
              </div>

              {openQuestion === question.id && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold">{question.question}</span>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold">คำตอบที่ถูกต้อง</span>
                    <div className="flex flex-col gap-2">
                      {questions.map((q, i) => (
                        <div className="mb-3 flex flex-col gap-2 text-sm text-neutral-900">
                          <div className="font-bold">กลุ่ม #{i + 1}</div>
                          <div className="break-words">{q.correct_answer.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-bold">คำตอบของนักเรียน</span>
                    <div className="flex flex-col gap-2">
                      {questions.map((q, i) => (
                        <div className="mb-3 flex flex-col gap-2 text-sm text-neutral-900">
                          <div className="font-bold">กลุ่ม #{i + 1}</div>
                          <div className="break-words">{q.answer.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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

export default CWModalQuestionInfoPairing;
