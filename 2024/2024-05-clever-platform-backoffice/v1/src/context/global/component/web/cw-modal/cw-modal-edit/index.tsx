import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';

interface ModalEditProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  label?: string;
  placeholder?: string;
  okButtonText?: string;
  onOk?: () => void;
  onSave?: (value: string) => void;
}

const CWModalEdit = ({
  open,
  onClose,
  children,
  onOk,
  label = 'ชื่อมาตรฐาน',
  placeholder = 'CEFR',
  okButtonText = 'บันทึก',
  onSave,
  ...rest
}: ModalEditProps) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Modal
      className="h-auto w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      title={'เปลี่ยนรหัสผ่าน'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder={placeholder}
            label={label}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div className="flex w-full justify-between gap-5 px-5 py-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button
            onClick={() => onSave?.(inputValue)}
            className="btn btn-primary flex w-full gap-1"
          >
            {okButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalEdit;
