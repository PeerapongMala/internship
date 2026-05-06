import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import ScreenTemplate from '../local/component/web/template/cw-t-line-layout';
import CWButton from '@component/web/cw-button';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@global/store/global/persist';
import API from '@domain/g05/g05-d00/local/api';
import CWInput from '../local/component/web/atom/cw-input';
import liff from '@line/liff';
import { callWithRetry } from '@global/utils/apiResponseHelper';

const DomainJsx = () => {
  const { history } = useRouter();
  const navigate = useNavigate();

  const refEmail = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';

  // Ensure LIFF is ready & token is fresh on mount (optional, UI might need it)
  useEffect(() => {
    if (!liffId) return;
    (async () => {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }
        const token = liff.getAccessToken() || '';
        StoreGlobalPersist.MethodGet().setLineProviderToken(token);
      } catch (err) {
        console.error('LIFF init error:', err);
      }
    })();
  }, [liffId]);

  const handleBack = () => {
    history.go?.(-1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    const email = refEmail.current?.value.trim() || '';
    const password = refPassword.current?.value.trim() || '';

    if (!email || !password) {
      setErrorMsg('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    try {
      // Always re-init LIFF & grab the freshest token
      if (!liffId) throw new Error('LIFF ID not set');
      await liff.init({ liffId });
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }
      const freshToken = liff.getAccessToken() || '';
      if (!freshToken) throw new Error('Unable to get access token from LIFF');

      // Persist it
      StoreGlobalPersist.MethodGet().setLineProviderToken(freshToken);

      // 1) bind-user-with-oauth
      const bindRes = await callWithRetry(API.Login, {
        email,
        password,
        provider_access_token: freshToken,
      });

      console.log('bind-user-with-oauth response:', bindRes);
      if (bindRes.status_code !== 200) {
        setErrorMsg(bindRes.message || 'เกิดข้อผิดพลาดในการเชื่อมโยงบัญชี');
        return;
      }

      // 2) loginWithOauth to fetch user & app token
      const loginRes = await callWithRetry(API.loginWithOauth, {
        provider_access_token: freshToken,
      });

      console.log('loginWithOauth response:', loginRes);
      if (loginRes.status_code === 404) {
        navigate({ to: '/line/connect/login-teacher' });
        return;
      }
      if (loginRes.status_code !== 200) {
        console.error('a01 API error:', loginRes);
        setErrorMsg('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
        return;
      }

      // success! store and go
      const user = loginRes.data[0];
      StoreGlobalPersist.MethodGet().setAccessToken(user.access_token);
      StoreGlobalPersist.MethodGet().setUserData(user);

      showMessage('Login สำเร็จ', 'success');
      navigate({ to: '/line/teacher/dashboard' });
    } catch (err) {
      console.error('Error in bind/login flow:', err);
      setErrorMsg('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenTemplate
      className="items-center justify-center"
      headerTitle="Clever Login"
      footer={false}
    >
      <p className="text-lg/7 font-bold">ครู</p>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-5">
        <CWInput label="email:" name="email" type="email" required ref={refEmail} />
        <CWInput
          label="password:"
          name="password"
          type="password"
          required
          ref={refPassword}
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <div className="flex w-full flex-row gap-3">
          <CWButton
            className="flex-1"
            title="กลับ"
            variant="white"
            type="button"
            onClick={handleBack}
          />
          <CWButton
            className="flex-1"
            title={isLoading ? 'กำลังโหลด...' : 'connect'}
            variant="primary"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </ScreenTemplate>
  );
};

export default DomainJsx;
