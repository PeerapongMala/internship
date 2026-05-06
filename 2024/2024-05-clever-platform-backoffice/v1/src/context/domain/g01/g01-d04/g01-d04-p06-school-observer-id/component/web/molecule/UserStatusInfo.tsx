import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import { IObserverInput } from '@domain/g01/g01-d04/local/type';
import { toDateTimeTH } from '@global/utils/date';
import { useState } from 'react';
import API from '@domain/g01/g01-d04/local/api';
import showMessage from '@global/utils/showMessage';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';

export interface UserStatusInfoProps {
  inputValueObserver: IObserverInput;
  setInputValueObserver: React.Dispatch<React.SetStateAction<IObserverInput>>;
  updateStatus?: { updateAt?: string | null; updateBy?: string | null };
  onSubmit?: () => void;
}

const UserStatusInfo: React.FC<UserStatusInfoProps> = ({
  inputValueObserver,
  setInputValueObserver,
  updateStatus,
  onSubmit,
}) => {
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const [isInAction, setIsInAction] = useState(false);
  const modalResetPassword = useModal();

  const handlePasswordReset = (password: string) => {
    if (!isInAction) {
      setIsInAction(true);
      API.schoolObserver
        .UpdatePassword({
          user_id: inputValueObserver.id,
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
    <div className="flex h-fit w-full min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
      <div className="grid grid-cols-2 place-items-baseline gap-y-4">
        <div>รหัสผู้ใช้งาน</div>
        <div>{inputValueObserver.id}</div>
        <div>สถานะ</div>
        <div className="w-full">
          <CWSelect
            value={inputValueObserver.status}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              setInputValueObserver((prev) => ({
                ...prev,
                status: event.target.value,
              }));
            }}
            options={[
              {
                label: 'แบบร่าง',
                value: 'draft',
              },
              {
                label: 'ใช้งาน',
                value: 'enabled',
              },
              {
                label: 'ไม่ใช้งาน',
                value: 'disabled',
              },
            ]}
            className="w-full"
            required
          />
        </div>
        <div>แก้ไขล่าสุด</div>
        <div>{updateStatus?.updateAt ? toDateTimeTH(updateStatus?.updateAt) : '-'}</div>
        <div>แก้ไขล่าสุดโดย</div>
        <div>{updateStatus?.updateBy ?? '-'}</div>
      </div>
      <button type="submit" className="btn btn-primary" onClick={onSubmit}>
        บันทึก
      </button>

      <button type="button" className="btn btn-primary" onClick={modalResetPassword.open}>
        เปลี่ยนรหัสผ่าน
      </button>

      <CWModalResetPassword
        open={modalResetPassword.isOpen}
        onOk={handlePasswordReset}
        onClose={() => {
          modalResetPassword.close();
        }}
      />
    </div>
  );
};

export default UserStatusInfo;
