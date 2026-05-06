import React, { useEffect } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import ScreenTemplate from '../local/component/web/template/cw-t-line-layout';
import StoreGlobalPersist from '@global/store/global/persist';
import liff from '@line/liff';
import API from '@domain/g05/g05-d00/local/api';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';

const DomainJsx = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role') || 'default';

  const navigate = useNavigate();
  const { history } = useRouter();
  const liffId = import.meta.env.VITE_LINE_LIFF_ID || '';

  // retry helper with a guaranteed return or throw
  const loginWithRetry = async (
    token: string,
    retries = 3,
    delay = 5000,
  ): Promise<DataAPIResponse<any[]> | FailedAPIResponse> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const resp = await API.loginWithOauth({ provider_access_token: token });
        if (resp.status_code === 500 && attempt < retries) {
          await new Promise((r) => setTimeout(r, delay * attempt));
          continue;
        }
        return resp;
      } catch (err) {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delay * attempt));
          continue;
        }
        throw err;
      }
    }
    throw new Error('loginWithRetry: no response');
  };

  useEffect(() => {
    const initLiff = async () => {
      if (!liffId) {
        console.error('LIFF ID is not set.');
        return;
      }

      try {
        await liff.init({ liffId });
      } catch (initErr) {
        console.error('LIFF initialization error:', initErr);
        return;
      }

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const freshToken = liff.getAccessToken();
      if (!freshToken) {
        console.error('Unable to get access token from LIFF.');
        return;
      }

      StoreGlobalPersist.MethodGet().setLineProviderToken(freshToken);
      console.log('Fresh token from LIFF:', freshToken);

      try {
        const resp = await loginWithRetry(freshToken);

        if (resp.status_code === 404) {
          if (role === 'family') {
            navigate({ to: '/line/connect/login-family-full' });
          } else if (role === 'teacher') {
            navigate({ to: '/line/connect/login-teacher' });
          } else {
            navigate({ to: '/line/connect/login-student' });
          }
          return;
        }
        if (resp.status_code !== 200) {
          console.error('a01 API error:', resp);
          return;
        }

        const user = resp.data[0];
        StoreGlobalPersist.MethodGet().setAccessToken(user.access_token);
        StoreGlobalPersist.MethodGet().setUserData(user);

        if (role === 'teacher') {
          navigate({ to: '/line/teacher/dashboard' });
        } else if (role === 'student') {
          navigate({ to: '/line/student/clever/dashboard/choose-student' });
        } else {
          navigate({ to: '/line/parent/clever/dashboard/choose-student' });
        }
      } catch (apiErr) {
        console.error('Error calling a01 API after retries:', apiErr);
      }
    };

    initLiff();
  }, [liffId, navigate, history, role]);

  return (
    <ScreenTemplate
      className="items-center justify-center"
      headerTitle="Line Connect"
      footer={false}
    >
      {/* blank page */}

      <div className="grid min-h-[325px] place-content-center dark:bg-opacity-[0.08]">
        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-black !border-l-transparent dark:border-white"></span>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
