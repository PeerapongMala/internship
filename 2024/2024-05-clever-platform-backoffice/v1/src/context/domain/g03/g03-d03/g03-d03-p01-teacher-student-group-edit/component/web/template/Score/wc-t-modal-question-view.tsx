import { useState } from 'react';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';

import {
  LevelItem,
  Question,
  QuestionType,
  TranslationChoice,
} from '@domain/g02/g02-d05/local/type';
import { LevelPlayLogItem } from '@component/web/template/cw-t-question-view/type';
import { Divider } from '@core/design-system/library/vristo/source/components/Divider';

interface WcModalQuestionViewProps extends ModalProps {
  open: boolean;
  onClose?: () => void;
  levelId?: number;
  levelPlayLogId?: number;
}

const QuestionView = ({
  question,
  // questionActive,
  // onClick,
  // mainLanguage,
  // playLog,
  // expandAll,
}: {
  question?: Question;
  // questionActive: number | null;
  // onClick: () => void;
  // mainLanguage?: LevelItem['language']['language'];
  // playLog?: LevelPlayLogItem | null;
  // expandAll?: boolean;
}) => {
  return (
    <>
      <div className="grid w-full grid-cols-3">
        <div className="text-left font-bold">ข้อที่ {question?.index}</div>
      </div>
      <div>
        <p className="font-bold">รูปแบบคำถาม</p>
        {/* {question?.question_type ? (
          <p className="pl-4">{QuestionType[question?.question_type]}</p>
        ) : (
          '-'
        )} */}
        คำถามปรนัยแบบเลือกตอบ
      </div>
      <div>
        <p className="font-bold">โจทย์</p>
        <p className="pl-4">จงเลือกคำตอบที่ถูกต้อง</p>
      </div>
      <div>
        <p className="font-bold">ตัวเลือก</p>
        <p className="pl-4">ก</p>
        <p className="pl-4">ข</p>
        <p className="pl-4">ค</p>
      </div>
      <div>
        <p className="font-bold">คำตอบ</p>
        <p className="pl-4">ก</p>
      </div>
      <div>
        <p className="font-bold">Hint</p>
        <p className="pl-4">-</p>
      </div>
    </>
  );
};
const WcModalQuestionView = ({
  open,
  onClose,
  children,
  onOk,
  levelId,
  levelPlayLogId,
  ...rest
}: WcModalQuestionViewProps) => {
  const [questionsList, setQuestionsList] = useState<Question[]>();
  const [standard, setStandard] = useState<LevelItem['standard']>();

  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="คำถาม"
      {...rest}
    >
      <div className="flex flex-col gap-2 text-base">
        <div>
          <p className="font-bold">วัตถุประสงค์การเรียนรู้</p>
          <p>{standard?.criteria_name}</p>
        </div>
        <div>
          <p className="font-bold">มาตรฐาน</p>
          <p>{standard?.learning_content_name}</p>
        </div>
        <div>
          <p className="font-bold">ตัวชี้วัด</p>
          <p>{standard?.indicator_name}</p>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-2 text-base">
        {/* {questionsList?.map((question, index) => (
          <div key={index}>
            <QuestionView
              question={question}
              // playLog={getPlayLogFromQuestion(question.id)}
              // questionActive={questionActive}
              // onClick={() => handleClickQuestion(question.id)}
              // mainLanguage={mainLanguage}
              // expandAll={expandAll}
            />
          </div>
        ))} */}
        <QuestionView />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ย้อนกลับ
        </button>
      </div>
    </Modal>
  );
};

export default WcModalQuestionView;
