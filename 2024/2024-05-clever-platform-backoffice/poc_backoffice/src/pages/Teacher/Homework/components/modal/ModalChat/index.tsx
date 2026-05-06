import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../../../api';

interface ModalChatProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const ModalChat: React.FC<ModalChatProps> = ({ isOpen, onClose, userId }) => {
    if (!isOpen) return null;

    const numbertest = 3

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-md w-[400px] h-[450px] relative">
                <div className='flex justify-between items-center bg-gray-100 px-5 py-3'>
                    <h1 className='font-bold text-[18px]'>Chat</h1>
                    <button onClick={onClose} className="">
                        ปิด
                    </button>
                </div>
                <div className='w-full flex flex-col px-5 mt-5'>

                    <div>
                        <p>จำนวน: {numbertest} คน</p>
                    </div>

                    <div className='mt-5'>
                        <label htmlFor="">ข้อความ</label>
                        <textarea name="" id="" className='form-textarea min-h-[100px] max-h-[150px]' placeholder='พิมพ์ข้อความ'></textarea>
                    </div>
                </div>
                <div className='w-full flex justify-center gap-5 absolute bottom-0 py-5 px-5'>
                    <button onClick={onClose} className='flex gap-2 btn btn-outline-primary w-32'>ยกเลิก</button>
                    <button className='flex gap-2 btn btn-primary w-32'>ส่ง</button>
                </div>

            </div>s

        </div>
    );
};

export default ModalChat