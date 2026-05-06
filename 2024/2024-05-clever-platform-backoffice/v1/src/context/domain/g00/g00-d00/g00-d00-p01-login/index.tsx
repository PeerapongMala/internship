// import { useTranslation } from 'react-i18next';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import Header from './component/web/atom/Header';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import config from '@core/config';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [emaildWrong, setEmailWrong] = useState<string>('');
  const [passwordWrong, setPasswordWrong] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, userData } = StoreGlobalPersist.StateGet([
    'accessToken',
    'userData',
  ]);
  const onInputChange = () => {
    if (passwordWrong) {
      setPasswordWrong('');
    }
    if (emaildWrong) {
      setEmailWrong('');
    }
    if (errors.email) {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
    }
    if (errors.password) {
      setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
    }
  };

  const handleError = (message: string) => {
    if (message === 'Unauthorized') {
      setPasswordWrong(t('รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง'));
      if (refPassword.current) refPassword.current.value = '';
      {
        /* reset รหัส */
      }
    } else if (message === 'Not found') {
      setEmailWrong(t('อีเมลไม่ถูกต้อง กรุณาลองอีกครั้ง'));
    } else {
      setPasswordWrong('');
      setEmailWrong('');
    }
  };

  const onClickLogin = () => {
    setIsLoading(true);
    const email = refEmail.current?.value;
    const password = refPassword.current?.value;

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t('กรุณากรอกอีเมล');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('รูปแบบอีเมลไม่ถูกต้อง กรุณาลองอีกครั้ง');
    }
    if (!password) {
      newErrors.password = t('กรุณากรอกรหัสผ่าน');
    }

    setErrors(newErrors);

    if (email && password) {
      API.auth
        .Login({
          email: email,
          password: password,
        })
        .then((res) => {
          setIsLoading(false);

          if (res.status_code === 200) {
            if (res.data.length > 0) {
              (
                StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
              ).setAccessToken(res.data[0].access_token);
              (
                StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
              ).setUserData(res.data[0]);

              // role admin
              if (res.data[0].roles.includes(1)) {
                navigate({
                  to: '/admin/report/progress-dashboard',
                });
              } else if (res.data[0].roles.includes(2)) {
                navigate({
                  to: '/curriculum',
                });
              }
              // role content-creator

              // role teacher
              if (res.data[0].roles[0] === 6) {
                navigate({
                  to: '/teacher/dashboard',
                });
              }

              // role gm
              if (res.data[0].roles[0] === 3) {
                navigate({
                  to: '/gamemaster/announcement',
                });
              }
              // ovserver
              if (res.data[0].roles[0] === 4) {
                navigate({
                  to: '/admin/report/progress-dashboard',
                });
              }
              // announcer
              if (res.data[0].roles[0] === 5) {
                navigate({
                  to: '/teacher/announcement',
                });
              }
            }
          } else {
            handleError(res.message);
          }
        })
        .catch((error) => {
          console.log({ error: error });
          showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์', 'error');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClickLogin();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden font-noto-sans-thai">
      <Header />
      <div className="flex h-screen w-full items-center justify-center px-5">
        <div className="h-[500px] w-[629px]">
          <h1 className="text-[20px] font-bold">{t('เข้าสู่ระบบ')}</h1>
          <div className="relative my-5">
            <div className="h-[85px]">
              <label htmlFor="">{t('อีเมล')}</label>
              <input
                ref={refEmail}
                type="text"
                className={`w-full rounded-md border bg-white px-5 py-2 text-[14px] focus:outline-none ${errors.email ? 'border-[2px] border-rose-500' : 'focus:border-primary'}`}
                onChange={onInputChange}
                onClick={onInputChange}
                placeholder="อีเมล"
              />
              <div className="mt-1.5">
                {errors.email && !emaildWrong && (
                  <span className="mt-5 text-sm text-red-500">{errors.email}</span>
                )}
                {emaildWrong && (
                  <span className="mt-5 text-sm text-red-500">{emaildWrong}</span>
                )}
              </div>
            </div>

            <div className="mt-3 h-[85px]">
              <label htmlFor="">{t('รหัสผ่าน')}</label>
              <input
                ref={refPassword}
                type="password"
                className={`w-full rounded-md border bg-white px-5 py-2 text-[14px] focus:outline-none ${errors.email ? 'border-[2px] border-rose-500' : 'focus:border-primary'}`}
                onChange={onInputChange}
                onClick={onInputChange}
                placeholder="รหัสผ่าน"
              />
              <div className="mt-1.5">
                {errors.password && !passwordWrong && (
                  <span className="mt-2 text-sm text-red-500">{errors.password}</span>
                )}
                {passwordWrong && (
                  <span className="mt-2 text-sm text-red-500">{passwordWrong}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={onClickLogin}
              className={`btn btn-primary w-full ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? t('กำลังโหลด...') : t('เข้าสู่ระบบ')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
