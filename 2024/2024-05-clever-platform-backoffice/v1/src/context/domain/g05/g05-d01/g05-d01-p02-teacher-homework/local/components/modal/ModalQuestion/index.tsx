import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

import {
  Modal,
  ModalProps,
} from '../../../../../../../../../core/design-system/library/vristo/source/components/Modal';

interface ModalQuestionProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  subjectId?: string;
}

const ModalQuestion = ({
  open,
  onClose,
  children,
  onOk,
  subjectId,
  ...rest
}: ModalQuestionProps) => {
  useEffect(() => {
    // API.Subject.SubjectById.Get(subjectId)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((data) => {
    //         setDataSubject(data);
    //     })
    //     .catch((err) => console.error(err));
  }, [subjectId]);

  const [openAccordions, setOpenAccordions] = useState([false, false]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

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
      <div className="flex flex-col">
        <div>
          <h1 className="font-bold">สาระการเรียนรู้</h1>
          <p>XXXXXX</p>
        </div>
        <div>
          <h1 className="font-bold">มาตรฐาน</h1>
          <p>XXXXXX</p>
        </div>
        <div>
          <h1 className="font-bold">ตัวชี้วัด</h1>
          <p>XXXXXX</p>
        </div>
        <div>
          <h1 className="font-bold">ประเภทคำถาม</h1>
          <p>XXXXXX</p>
        </div>
      </div>
      <hr className="my-5" />
      <div className="w-full">
        <div
          className="flex items-center justify-between bg-gray-100 px-4 hover:cursor-pointer"
          onClick={() => toggleAccordion(0)}
        >
          <button className="bg-gray-100 py-2">
            {openAccordions[0] ? (
              <span className="mr-2">▼ ข้อที่1</span> // ลูกศรชี้ลง
            ) : (
              <span className="mr-2">▲ ข้อที่1</span> // ลูกศรชี้ขึ้น
            )}
          </button>
          <p className="-ml-5">8 วินาที</p>
          <p>ถูก</p>
        </div>
        {openAccordions[0] && (
          <div className="mt-3 bg-gray-50 p-4">
            <div>
              <div className="flex justify-around gap-5 py-5">test</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex w-full justify-center">
        <button className="btn btn-outline-primary flex w-32 gap-2" onClick={onClose}>
          ย้อนกลับ
        </button>
      </div>
    </Modal>
  );
};

export default ModalQuestion;
