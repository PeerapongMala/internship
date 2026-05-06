import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

import { Modal, ModalProps } from '@component/web/cw-modal';

export enum Tier {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface Question {
  learningarea_name?: string;
  standard_name?: string;
  indicator_name?: string;
  answer?: string[];
}

export interface DataHomework {
  id: number;
  sublesson_name?: string;
  level: number; //ด่านที่
  type_question: string; //รูปแบบคำถาม
  tier: Tier;
  totalAvg: number; //คะแนนรวมเฉลี่ย
  readyexam: number; //ทำข้อสอบแล้ว
  readyexamAvg: number; //ทำข้อสอบโดยเฉลี่ย
  examAvg: number; //ทำข้อสอบแล้ว
  time: number; // เวลาเฉลี่ย
  question?: Question;
  status_homework?: StatusHomework; //สถานะกรบ้าน
  status?: Status;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export enum StatusHomework {
  DEU = 'การบ้านที่ต้องส่ง',
  UPCOMMING = 'การบ้านที่สั่งล่วงหน้า',
  PAST = 'การบ้านที่ผ่านมา',
}

interface ModalQuestionProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  subjectId?: string;
  questionId: number | null;
  data?: DataHomework[];
}

const ModalQuestionOne = ({
  open,
  onClose,
  children,
  onOk,
  subjectId,
  questionId,
  data,
  ...rest
}: ModalQuestionProps) => {
  const [record, setRecord] = useState<DataHomework | null>(null);

  useEffect(() => {
    if (data && questionId !== null) {
      const foundQuestion = data.find((item) => item.id === questionId);
      setRecord(foundQuestion || null);
    }
  }, [data, questionId]);

  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="คำตอบ"
      {...rest}
    >
      {record ? (
        <>
          <div className="flex flex-col">
            <div>
              <h1 className="font-bold">สาระการเรียนรู้</h1>
              <p>{record.question?.learningarea_name || '-'}</p>
            </div>
            <div>
              <h1 className="font-bold">มาตรฐาน</h1>
              <p>{record.question?.standard_name || '-'}</p>
            </div>
            <div>
              <h1 className="font-bold">ตัวชี้วัด</h1>
              <p>{record.question?.indicator_name || '-'}</p>
            </div>
            <div>
              <h1 className="font-bold">ประเภทคำถาม</h1>
              <p>{record.type_question || '-'}</p>
            </div>
          </div>
          <hr className="my-5" />
          <div className="w-full">
            <h1 className="font-bold">ข้อที่ 1</h1>
            <p>จงเลือกคำตอบที่ถูกต้อง</p>
            {record.question?.answer?.map((choice, index) => (
              <p key={index}>
                {String.fromCharCode(65 + index)}. {choice}
              </p> // แสดงตัวเลือก ก ข ค
            ))}
          </div>
        </>
      ) : (
        <p className="text-center">ไม่พบข้อมูลคำถาม</p>
      )}
      <div className="mt-4 flex w-full justify-center">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ย้อนกลับ
        </button>
      </div>
    </Modal>
  );
};

export default ModalQuestionOne;
