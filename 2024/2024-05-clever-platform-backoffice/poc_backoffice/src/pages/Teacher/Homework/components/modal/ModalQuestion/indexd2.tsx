import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../../../api';
import { Subject } from '../../../type';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectId: string;
}


const ModalQuestion: React.FC<ModalProps> = ({ isOpen, onClose, subjectId }) => {
    if (!isOpen) return null;
    const [dataSubject, setDataSubject] = useState<Subject>();
    console.log(dataSubject)
    
      useEffect(() =>{
          API.Subject.SubjectById.Get(subjectId)
          .then((res) => {
              return res.json();
            })
            .then((data) => {
              setDataSubject(data);
            })
            .catch((err) => console.error(err));
      },[subjectId])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-md w-[400px] h-[650px] relative">
                <div className='flex justify-between items-center bg-gray-100 px-5 py-3'>
                    <h1 className='font-bold text-[18px]'>คำถาม</h1>
                    <button onClick={onClose} className="">
                        ปิด
                    </button>
                </div>
                <div className='w-full flex flex-col px-5 mt-5'>

                    <div>
                        <p>ModalQuestion</p>
                    </div>
                    <hr />
                    <div>
                        <p>ModalQuestion</p>
                    </div>
                    <div className='w-full flex justify-center '>
                        <button onClick={onClose}>ย้อนกลับ</button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ModalQuestion