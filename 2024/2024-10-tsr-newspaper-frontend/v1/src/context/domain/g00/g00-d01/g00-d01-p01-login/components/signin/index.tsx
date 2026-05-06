import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import StoreGlobalPersist from '@store/global/persist';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../../../local/icon/icon-login';
import { LoginCredentials } from '../../types/auth';
import { useAuth } from '../use-auth';
function SignIn() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email_or_username: '',
    password: '',
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = name === 'email_or_username' ? value.trim() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await login(formData);

    if (response) {
      setShowNotification(true);

      StoreGlobalPersist.MethodGet().AccessTokenSet(response.data.access_token);
      StoreGlobalPersist.MethodGet().RoleSet(response.data.role.toString());
      StoreGlobalPersist.MethodGet().setUserData(response.data);

      setTimeout(() => {
        setShowNotification(false);
        navigate('/');
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-dark w-[570px] py-[48px] sm:px-[72px] px-[24px] flex flex-col gap-[32px] items-center rounded-[20px]"
    >
      <p className="font-semibold text-[28px] leading-7 text[#262626] dark:text-white">
        เข้าสู่ระบบ
      </p>

      {error && (
        <div className="w-full px-4 py-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-500/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      <NotificationSuccess show={showNotification} title="Login successfully" />

      <div className="flex flex-col gap-6 w-full">
        <div className="space-y-3 w-full">
          <p className="text-[16px] leading-4 text-[#344054] dark:text-[#D7D7D7]">
            อีเมล/ชื่อผู้ใช้งาน
          </p>
          <input
            name="email_or_username"
            value={formData.email_or_username}
            onChange={handleInputChange}
            className="py-[12px] px-[16px] w-full bg-transparent border-[1px] rounded-lg border-[#D0D5DD] dark:border-[#737373] dark:text-white"
            required
          />
        </div>
        <div className="space-y-3 w-full">
          <div className="flex justify-between w-full">
            <p className="text-[16px] leading-4 text-[#344054] dark:text-[#D7D7D7]">
              รหัสผ่าน
            </p>
            <Link to='/forgot-password' className="text-[16px] leading-4 text-[#262626] dark:text-[#D7D7D7]">
              ลืมรหัสผ่าน？
            </Link>
          </div>
          <div className="relative flex w-full">
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="py-[12px] px-[16px] w-full bg-transparent border-[1px] rounded-lg border-[#D0D5DD] dark:border-[#737373] dark:text-white"
              type={showPassword ? 'text' : 'password'}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={handleShowPassword}
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary rounded-[6px] text-[14px] leading-[14px] font-semibold py-[12px] text-white disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
          <p className="text-[16px] leading-[16px] text-[#414141] dark:text-[#D7D7D7]">
            ยังไม่ได้เป็นสมาชิก?{' '}
            <a
              href="/sign-up"
              className="text-secondary hover:text-secondary/80 transition-colors duration-200 cursor-pointer"
            >
              สมัครสมาชิก
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}

export default SignIn;
