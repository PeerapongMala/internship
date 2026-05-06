import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';

interface ModalCheckpointProps {
  isOpen: boolean;
  onClose: () => void;
  checkpointId: string;
}

const ModalChat: React.FC<ModalCheckpointProps> = ({ isOpen, onClose, checkpointId }) => {
  if (!isOpen) return null;

  const numbertest = 3;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative h-[450px] w-[400px] rounded bg-white shadow-md">
        <div className="flex items-center justify-between bg-gray-100 px-5 py-3">
          <h1 className="text-[18px] font-bold">Chat</h1>
          <button onClick={onClose} className="">
            ปิด
          </button>
        </div>
        <div className="mt-5 flex w-full flex-col px-5">
          <div>
            <p>จำนวน: {numbertest} คน</p>
          </div>

          <div className="mt-5">
            <label htmlFor="">ข้อความ</label>
            <textarea
              name=""
              id=""
              className="form-textarea max-h-[150px] min-h-[100px]"
              placeholder="พิมพ์ข้อความ"
            ></textarea>
          </div>
        </div>
        <div className="absolute bottom-0 flex w-full justify-center gap-5 px-5 py-5">
          <button
            onClick={onClose}
            className="w-full rounded-md border px-5 py-2 font-bold"
          >
            ยกเลิก
          </button>
          <button className="w-full rounded-md border bg-primary px-5 py-2 font-bold text-white shadow-lg">
            ส่ง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalChat;
