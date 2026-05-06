import StoreGlobalPersist from '@store/global/persist';
import { ChangeEvent, useMemo, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import { changeUserPassword } from '@domain/g02/g02-d01/local/api/restapi/change-password';
import { NotificationState, NotificationType  } from '@component/web/atom/notification/type'; 


type ChangePassword = {
  password: string;
  new_password: string;
  confirm_new_password: string;
};
interface FormErrors {
  [key: string]: string;
}


export default function ChangePass() {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordUpdate, setPasswordUpdate] = useState<ChangePassword>({
    password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const togglePasswordVisibility = (
    field: 'oldPassword' | 'newPassword' | 'confirmPassword',
  ) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordUpdate({
      ...passwordUpdate,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const isDisabled = useMemo(() => {
    return (
      !passwordUpdate.password.trim() ||
      !passwordUpdate.new_password.trim() ||
      !passwordUpdate.confirm_new_password.trim()
    );
  }, [passwordUpdate]);



  const handleSubmit = async () => {
    setIsSubmitting(true);
    const newErrors: FormErrors = {};

    
    if (!passwordUpdate.password.trim()) {
      newErrors.password = 'กรุณากรอกรหัสผ่านเดิม';
    }

    if (!passwordUpdate.new_password.trim()) {
      newErrors.new_password = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (
      passwordUpdate.new_password.length < 6 ||
      passwordUpdate.new_password.length > 12
    ) {
      newErrors.new_password = 'รหัสผ่านใหม่ต้องมีความยาวระหว่าง 6 ถึง 12 ตัวอักษร';
    }

    if (passwordUpdate.new_password !== passwordUpdate.confirm_new_password) {
      newErrors.confirm_new_password = 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false); 
      return;
    }

    try {
      await changeUserPassword(accessToken, passwordUpdate);
      setNotification({
        show: true,
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        type: 'success',
      });
      setErrors({});
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: 'เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนรหัสผ่านได้',
      }));
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนรหัสผ่านได้',
        type: 'error',
      });
    }
     finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
        window.location.reload()
      }, 3000);
    }
  };

  return (
    <>
      <section>
        <h3 className="text-gray-700 dark:text-white font-semibold text-2xl mb-10 md:mb-[18px] text-left">
          เปลี่ยนรหัสผ่าน
        </h3>
        <NotificationSuccess
          show={notification.show && notification.type === 'success'}
          title={notification.title}
          message={notification.message}
        />
        <NotificationError
          show={notification.show && notification.type === 'error'}
          title={notification.title}
          message={notification.message}
        />

        <div className="grid grid-cols-1 sm:flex-row gap-y-10 lg:gap-4  w-full">
          <div className="w-full lg:max-w-sm">
            <CustomLabel text="รหัสผ่านเดิม" />
            <div className="relative w-full">
              <input
                id="hs-toggle-password"
                name="password"
                type={showPassword.oldPassword ? 'text' : 'password'}
                className={`border p-2 rounded-md w-full bg-white dark:bg-[#262626] pr-10 dark:border-[#737373] box-border ${errors.password ? 'border-red-500' : ''
                  }`}
                placeholder=""
                value={passwordUpdate.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('oldPassword')}
                className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="w-full lg:max-w-sm">
            <CustomLabel text="รหัสผ่านใหม่" />
            <div className="relative w-full">
              <input
                id="hs-toggle-password"
                name="new_password"
                type={showPassword.newPassword ? 'text' : 'password'}
                className={`border p-2 rounded-md w-full bg-white dark:bg-[#262626] pr-10 dark:border-[#737373] box-border ${errors.new_password ? 'border-red-500' : ''}`}
                placeholder=""
                value={passwordUpdate.new_password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
              )}{' '}

            </div>
          </div>
          <div className="w-full lg:max-w-sm">
            <CustomLabel text="ยืนยันรหัสผ่านใหม่" />
            <div className="relative w-full">
              <input
                id="hs-toggle-password"
                name="confirm_new_password"
                type={showPassword.confirmPassword ? 'text' : 'password'}
                className={`border p-2 rounded-md w-full bg-white dark:bg-[#262626] pr-10 dark:border-[#737373] box-border ${errors.confirm_new_password ? 'border-red-500' : ''}`}
                placeholder=""
                value={passwordUpdate.confirm_new_password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirm_new_password && (
                <p className="text-red-500 text-xs mt-1">{errors.confirm_new_password}</p>
              )}{' '}

            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-start w-full mt-10 space-y-4 md:space-y-0 md:space-x-[9px] md:mb-6 md:mt-12">
          <div className="w-full md:w-auto">
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`w-full md:w-44 text-white text-sm rounded-md py-2 px-6 font-semibold ${isDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#D9A84E] hover:bg-yellow-600'
                }`}
            >
              บันทึก
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

const CustomLabel = ({ text }: { text: string }) => {
  return (
    <label className="block text-sm font-normal text-[#414141] leading-[14px] mb-2 dark:text-[#D7D7D7]">
      {text}
      <span className="text-red-500">*</span>
    </label>
  );
};
