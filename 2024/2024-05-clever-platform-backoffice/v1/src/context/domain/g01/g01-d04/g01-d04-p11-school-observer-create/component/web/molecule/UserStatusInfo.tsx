import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWSelect from '@component/web/cw-select';
import { IObserverInput } from '@domain/g01/g01-d04/local/type';

export interface UserStatusInfoProps {
  inputValueObserver: IObserverInput;
  setInputValueObserver: React.Dispatch<React.SetStateAction<IObserverInput>>;
  onSubmit?: () => void;
  modalResetPassword: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  handlePasswordReset: (password: string) => void;
}

const UserStatusInfo: React.FC<UserStatusInfoProps> = ({
  inputValueObserver,
  setInputValueObserver,
  onSubmit,
  modalResetPassword,
  handlePasswordReset,
}) => {
  return (
    <div className="flex h-fit w-full min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
      <div className="grid grid-cols-2 place-items-baseline gap-y-4">
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
      </div>
      <div className="flex flex-col gap-4">
        <button type="button" className="btn btn-primary" onClick={() => onSubmit?.()}>
          บันทึก
        </button>

        <button
          type="button"
          className="btn btn-primary text-sm font-bold text-white shadow-md"
          onClick={() => modalResetPassword.open()}
        >
          กำหนดรหัสผ่าน
        </button>
      </div>

      <CWModalResetPassword
        open={modalResetPassword.isOpen}
        onOk={(password) => {
          handlePasswordReset(password);
        }}
        onClose={() => {
          modalResetPassword.close();
        }}
      />
    </div>
  );
};

export default UserStatusInfo;
