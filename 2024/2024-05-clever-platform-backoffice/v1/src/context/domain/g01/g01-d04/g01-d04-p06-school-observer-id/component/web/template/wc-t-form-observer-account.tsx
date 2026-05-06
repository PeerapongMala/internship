import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWInput from '@component/web/cw-input';
import { useState } from 'react';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g01/g01-d04/local/api';
import { IObserverInput } from '@domain/g01/g01-d04/local/type';

interface FormObserverAccountProps {
  observerId: string;
  observerInput: IObserverInput;
}

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

export default function FormObserverAccount({
  observerId,
  observerInput,
}: FormObserverAccountProps) {
  const [isInAction, setIsInAction] = useState(false);
  const modalResetPassword = useModal();

  const handlePasswordReset = (password: string) => {
    if (!isInAction) {
      setIsInAction(true);
      API.schoolObserver
        .UpdatePassword({
          user_id: observerId,
          password: password,
        })
        .then((res) => {
          if (res.status_code === 200) {
            showMessage('เปลี่ยนรหัสผ่านสำเร็จ', 'success');
          } else {
            showMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          showMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        })
        .finally(() => {
          setIsInAction(false);
          modalResetPassword.close();
        });
    }
  };

  return (
    <>
      <div className="panel flex h-auto w-full flex-col gap-4">
        <div className="w-full lg:w-1/2">
          <p className="mb-6 text-lg font-bold">ข้อมูลบัญชี</p>
          <CWInput
            label="อีเมล:"
            type="email"
            value={observerInput.email}
            placeholder="กรุณาระบุ อีเมล"
            required
            disabled
          />
        </div>
        <div>
          <p className="mb-6 text-lg font-bold">รหัสผ่าน</p>
          <button
            type="button"
            className="mb-6 h-[36px] w-[166px] rounded bg-primary text-sm font-bold text-white shadow-md"
            onClick={modalResetPassword.open}
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
        {/* todo: refactor ui, */}
        {/* <p className="text-lg font-bold mb-6">การเชื่อมต่อบัญชี</p>
         <div className="flex justify-between">
          <div className="flex">
            <IconFacebook fill={true} className="w-[40px] h-[40px]" />
            <div className="flex flex-col">
              <p className="text-sm font-bold">LINE</p>
              <p className="text-sm">ID: 000001</p>
            </div>
          </div>
          <button className="bg-danger text-sm text-white font-bold rounded w-[166px] h-[36px] shadow-md mb-6">
            ยกเลิกการเชื่อมต่อ
          </button>
        </div> */}
      </div>
      <CWModalResetPassword
        open={modalResetPassword.isOpen}
        onOk={handlePasswordReset}
        onClose={() => {
          modalResetPassword.close();
        }}
      />
    </>
  );
}
