import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import ScreenTemplate from '../local/component/web/template/cw-t-line-layout';
import CWButton from '@component/web/cw-button';
import CWInput from '../local/component/web/atom/cw-input';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@global/store/global/persist';
import API from '@domain/g05/g05-d00/local/api';
import liff from '@line/liff';
import { callWithRetry } from '@global/utils/apiResponseHelper';

const DomainJsx = () => {
  const { history } = useRouter();
  const navigate = useNavigate();

  const refPrefix = useRef<HTMLInputElement>(null);
  const refFirstName = useRef<HTMLInputElement>(null);
  const refLastName = useRef<HTMLInputElement>(null);
  const refEmail = useRef<HTMLInputElement>(null);
  const refPhone = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';

  // Ensure LIFF token exists on mount (so form shows promptly)
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

    const prefix = refPrefix.current?.value.trim() || '';
    const first_name = refFirstName.current?.value.trim() || '';
    const last_name = refLastName.current?.value.trim() || '';
    const email = refEmail.current?.value.trim() || '';
    const phone_no = refPhone.current?.value.trim() || '';

    if (!prefix || !first_name || !last_name || !email || !phone_no) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    setIsLoading(true);
    try {
      // Always re-init LIFF & grab a fresh token
      if (!liffId) throw new Error('LIFF ID not set');
      await liff.init({ liffId });
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }
      const freshToken = liff.getAccessToken() || '';
      if (!freshToken) throw new Error('Unable to get access token from LIFF');
      StoreGlobalPersist.MethodGet().setLineProviderToken(freshToken);

      // a04: register parent
      const bindRes = await callWithRetry(API.registerParent, {
        provider: 'line',
        provider_access_token: freshToken,
        title: prefix,
        first_name,
        last_name,
        email,
        phone_no,
      });

      console.log('registerParent response:', bindRes);
      if (bindRes.status_code !== 200) {
        setErrorMsg(bindRes.message || 'เกิดข้อผิดพลาดในการสมัครผู้ปกครอง');
        return;
      }

      // bind succeeded, now fetch user data via a01
      const loginRes = await callWithRetry(API.loginWithOauth, {
        provider_access_token: freshToken,
      });

      console.log('loginWithOauth response:', loginRes);
      if (loginRes.status_code === 404) {
        navigate({ to: '/line/connect/login-family-full' });
        return;
      }
      if (loginRes.status_code !== 200) {
        console.error('a01 API error:', loginRes);
        setErrorMsg('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
        return;
      }

      // success: store user data and access token
      const user = loginRes.data[0];
      StoreGlobalPersist.MethodGet().setAccessToken(user.access_token);
      StoreGlobalPersist.MethodGet().setUserData(user);

      showMessage('Login สำเร็จ', 'success');
      navigate({ to: '/line/parent/clever/dashboard/choose-student' });
    } catch (err) {
      console.error('Error in parent bind/login flow:', err);
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
      <p className="text-lg/7 font-bold">ผู้ปกครอง</p>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-5">
        <CWInput
          label="คำนำหน้า:"
          name="prefix"
          defaultValue="นาย"
          ref={refPrefix}
          required
        />
        <CWInput label="ชื่อ:" name="firstName" ref={refFirstName} required />
        <CWInput label="นามสกุล:" name="lastName" ref={refLastName} required />
        <CWInput
          label="อีเมล:"
          name="email"
          type="email"
          defaultValue="myemail@gmail.com"
          ref={refEmail}
          required
        />
        <CWInput
          label="เบอร์โทร:"
          name="phone"
          placeholder="xxx-xxx-xxxx"
          ref={refPhone}
          required
        />

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <div className="flex w-full flex-row gap-3">
          <CWButton
            className="flex-1"
            title="กลับ"
            variant="white"
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
