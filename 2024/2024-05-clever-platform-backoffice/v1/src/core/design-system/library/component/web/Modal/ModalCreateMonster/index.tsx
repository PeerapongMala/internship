import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import { MonsterData, Monster } from './Type';

interface ModalCreateMonsterProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalCreateMonster = ({
  open,
  onClose,
  children,
  onOk,
  ...rest
}: ModalCreateMonsterProps) => {
  const [monster, setMonster] = useState<Monster[]>(MonsterData || []);

  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="เลือกมอนเตอร์"
      {...rest}
    >
      <div className="relative flex max-h-[650px] flex-col overflow-y-auto">
        <div className="w-full px-10 py-5">
          <div className="grid grid-cols-3 gap-10">
            {monster.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center border-4 p-1 duration-200 hover:scale-105 hover:border-red-400"
              >
                <img
                  src={data.image}
                  alt=""
                  className="xl:h-[200px]object-cover xl:w-[200px]"
                />
                <p>{data.MonsterName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between gap-5 px-5 py-5">
        <button onClick={onClose} className="btn btn-outline-primary flex w-32 gap-2">
          ย้อนกลับ
        </button>
        <button className="btn btn-primary flex w-32 gap-2">เลือก</button>
      </div>
    </Modal>
  );
};

export default ModalCreateMonster;
