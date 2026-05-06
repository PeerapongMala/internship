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

  const refSchoolCode = useRef<HTMLInputElement>(null);
  const refStudentCode = useRef<HTMLInputElement>(null);
  const refPin = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';

  // Ensure LIFF token exists on mount (so form shows promptly)
  useEffect(() => {
    if (!liffId) {
      console.error('LIFF ID is not set.');
      return;
    }
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

  const handleBack = () => history.go?.(-1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    const school_code = refSchoolCode.current?.value.trim() || '';
    const student_id = refStudentCode.current?.value.trim() || '';
    const pin = refPin.current?.value.trim() || '';

    if (!school_code || !student_id || !pin) {
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

      // a02: bind student
      const bindRes = await callWithRetry(API.bindStudentWithOauth, {
        school_code,
        student_id,
        pin,
        provider_access_token: freshToken,
      });
      console.log('bindStudentWithOauth response:', bindRes); // TODO: remove console.log in prod

      if (bindRes.status_code !== 200) {
        setErrorMsg(bindRes.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
        return;
      }

      // bind succeeded, now fetch user data via a01
      const loginRes = await callWithRetry(API.loginWithOauth, {
        provider_access_token: freshToken,
      });
      console.log('loginWithOauth response:', loginRes); // TODO: remove console.log in prod

      if (loginRes.status_code === 404) {
        navigate({ to: '/line/connect/login-student' });
        return;
      }
      if (loginRes.status_code !== 200) {
        console.error('a01 API error:', loginRes);
        setErrorMsg('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
        return;
      }

      const user = loginRes.data[0];
      StoreGlobalPersist.MethodGet().setAccessToken(user.access_token);
      StoreGlobalPersist.MethodGet().setUserData(user);

      showMessage('Login สำเร็จ', 'success');
      navigate({ to: '/line/student/clever/dashboard' });
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
      <p className="text-lg/7 font-bold">นักเรียน</p>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-5">
        <CWInput
          label="รหัสโรงเรียน:"
          name="schoolCode"
          placeholder="รหัสโรงเรียน"
          ref={refSchoolCode}
          required
        />
        <CWInput
          label="รหัสนักเรียน:"
          name="studentCode"
          ref={refStudentCode}
          required
          placeholder="รหัสนักเรียน"
        />
        <CWInput
          label="PIN:"
          name="pin"
          type="password"
          ref={refPin}
          required
          placeholder="pin"
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
