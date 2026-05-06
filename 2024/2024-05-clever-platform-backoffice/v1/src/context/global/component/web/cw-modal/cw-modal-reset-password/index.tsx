import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '../Modal';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import CWInput from '@component/web/cw-input';

type Mode = 'pin' | 'normal';

interface ModalResetPasswordProps extends Omit<ModalProps, 'onOk'> {
  open: boolean;
  onClose: () => void;
  onOk: (password: string) => void;
  mode?: Mode;
  maxLength?: number;
}

const CWModalResetPassword = ({
  open,
  onClose,
  children,
  onOk,
  mode = 'normal',
  maxLength,
  ...rest
}: ModalResetPasswordProps) => {
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    if (!open) {
      setPassword('');
    }
  }, [open]);

  const handlePasswordChange = (value: string) => {
    if (mode === 'pin') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
      setPassword(digitsOnly);
    } else {
      setPassword(value);
    }
  };

  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      disableCancel
      disableOk
      title={'เปลี่ยนรหัสผ่าน'}
      {...rest}
    >
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <CWInput
            placeholder={
              mode === 'pin' ? 'กรุณากรอก PIN 4 หลัก' : 'กรุณากรอกรหัสผ่านใหม่'
            }
            label={'รหัสผ่านใหม่'}
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            maxLength={maxLength !== undefined ? maxLength : undefined}
          />
        </div>

        <div className="mt-5 flex w-full justify-between gap-5">
          <button onClick={onClose} className="btn btn-outline-dark flex w-full gap-2">
            ยกเลิก
          </button>
          <button
            onClick={() => {
              onOk && onOk(password);
            }}
            className="btn btn-primary flex w-full gap-1"
          >
            บันทึก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalResetPassword;
