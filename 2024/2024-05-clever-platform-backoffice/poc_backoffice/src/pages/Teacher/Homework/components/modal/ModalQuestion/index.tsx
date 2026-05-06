import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../../api';
import { Subject } from '../../../type';
import { Modal, ModalProps } from '../../../../../../components/Modal';

interface ModalQuestionProps extends ModalProps {
    open: boolean;
    onClose: () => void;
    subjectId: string;
}

const ModalQuestion = ({ open, onClose, children, onOk, subjectId, ...rest }: ModalQuestionProps) => {
    const [dataSubject, setDataSubject] = useState<Subject>();
    console.log(dataSubject);

    useEffect(() => {
        API.Subject.SubjectById.Get(subjectId)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setDataSubject(data);
            })
            .catch((err) => console.error(err));
    }, [subjectId]);

    const dataTier = [
        {
            id: 1,
            tier: "ง่าย"
        },
        {
            id: 2,
            tier: "ง่าย"
        },
        {
            id: 3,
            tier: "ง่าย"
        },
        {
            id: 4,
            tier: "ปานกลาง"
        },
        {
            id: 5,
            tier: "ปานกลาง"
        },
        {
            id: 6,
            tier: "ปานกลาง"
        },
        {
            id: 7,
            tier: "ยาก"
        },
        {
            id: 8,
            tier: "ยาก"
        },
        {
            id: 9,
            tier: "ยาก"
        },
    ]

    const [openAccordions, setOpenAccordions] = useState([false, false]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [checkedItems, setCheckedItems] = useState(Array(dataTier.length).fill(false));

    const toggleAccordion = (index: number) => {
        setOpenAccordions(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const handleCheckboxChange = (index: number) => {
        setCheckedItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = !updatedItems[index];
            return updatedItems;
        });
    };
    const openModal = (id: number) => {
        setSelectedId(id);
        setIsOpen(true);
    };

    return (
        <Modal 
        className="w-[400px] min-h-[550px]"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="คำตอบ"
            {...rest}>

                <div className=" flex flex-col gap-2">
                    <div className='flex flex-col'>
                        <div>
                            <h1 className='font-bold'>สาระการเรียนรู้</h1>
                            <p>XXXXXX</p>
                        </div>
                        <div>
                            <h1 className='font-bold'>มาตรฐาน</h1>
                            <p>XXXXXX</p>
                        </div>
                        <div>
                            <h1 className='font-bold'>ตัวชี้วัด</h1>
                            <p>XXXXXX</p>
                        </div>
                        <div>
                            <h1 className='font-bold'>ประเภทคำถาม</h1>
                            <p>XXXXXX</p>
                        </div>


                    </div>
                    <hr className='my-5' />
                    <div className='w-full'>
                        <div className='flex justify-between items-center bg-gray-100 px-4 hover:cursor-pointer' onClick={() => toggleAccordion(0)}>
                            <button  className="bg-gray-100 py-2">
                                {openAccordions[0] ? (
                                    <span className="mr-2">▼  ข้อที่1</span> // ลูกศรชี้ลง
                                ) : (
                                    <span className="mr-2">▲  ข้อที่1</span> // ลูกศรชี้ขึ้น
                                )}
                               
                            </button>
                            <p className='-ml-5'>8 วินาที</p>
                            <p>ถูก</p>
                        </div>
                        {openAccordions[0] && (
                            <div className="p-4 bg-gray-50 mt-3">
                                <div>
                                    <div className='flex justify-around gap-5 py-5'>
                                        test
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full flex justify-center">
                        <button
                        className='flex gap-2 btn btn-outline-primary w-32'
                        onClick={onClose}>ย้อนกลับ</button>
                    </div>
                </div>
        </Modal >
    );
};

export default ModalQuestion;
