import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';

interface ModalEditProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

const ModalEdit = ({ open, onClose, children, onOk, ...rest }: ModalEditProps) => {
  return (
    <Modal
      className="h-auto w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'เปลี่ยนรหัสผ่าน'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <Input
            placeholder="CEFR"
            label={'ชื่อมาตรฐาน'}
            onChange={(e) => console.log(e.target.value)}
          />
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button className="btn btn-primary flex w-full gap-1"> บันทึก</button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEdit;
