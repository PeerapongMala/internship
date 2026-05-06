import { useState } from 'react';

import Modal, { ModalProps } from '../Modal';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown.tsx';

interface CWModalQuestionInfoPlaceholderProps extends ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
}

const CWModalQuestionInfoPlaceholder = ({
  title,
  open,
  onClose,
}: CWModalQuestionInfoPlaceholderProps) => {
  // Mock data for multiple questions
  const questions = [
    {
      id: 1,
      question: 'ปลา',
      duration_seconds: 8,
      correct_answer: 'Fish',
      answer: 'Fish',
    },
    {
      id: 2,
      question: 'เด็ก',
      duration_seconds: 8,
      correct_answer: 'Child',
      answer: 'Child',
    },
    {
      id: 3,
      question: 'ต้นไม้',
      duration_seconds: 8,
      correct_answer: 'Tree',
      answer: 'Tree',
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
                  {question.correct_answer == question.answer ? 'ถูก' : 'ผิด'}
                </span>
              </div>

              {openQuestion === question.id && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-bold">เติมคำตามที่กำหนด</span>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold">คำตอบที่ถูกต้อง</span>
                    <div className="flex flex-col gap-2">
                      {questions.map((q, i) => (
                        <div className="grid grid-cols-2 text-sm text-neutral-900">
                          <div className="w-1/3 break-words font-bold">
                            โจทย์ #{i + 1}
                          </div>
                          <div className="w-2/3 break-words font-bold">เฉลย</div>
                          <div className="w-1/3 break-words">{q.question}</div>
                          <div className="w-2/3 break-words">{q.correct_answer}</div>
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-bold">คำตอบของนักเรียน</span>
                    <div className="flex flex-col gap-2">
                      {questions.map((q, i) => (
                        <div className="grid grid-cols-2 text-sm text-neutral-900">
                          <div className="w-1/3 break-words font-bold">
                            โจทย์ #{i + 1}
                          </div>
                          <div className="w-2/3 break-words"></div>
                          <div className="w-1/3 break-words">{q.question}</div>
                          <div className="w-2/3 break-words">{q.answer}</div>
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

export default CWModalQuestionInfoPlaceholder;
