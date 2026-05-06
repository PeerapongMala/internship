import React, { useEffect, useState } from 'react';
import { API, ARCADE_GAME_ID } from '@core-utils/api';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate.tsx';
import CloudModelViewer from './components/CloudModelViewer';
import { IGetDataResponse } from '@core-utils/api/arcade/arcade-repository';
import { useArcadeStore } from '@/utils/core-utils/api/arcade/arcade-store';
import { useAuthStore } from '@/utils/core-utils/api/auth/auth-store';
import { ScrollableModal } from '../../ui/scrollable-modal/ScrollableModal';
// import { ThreeModelRenderer as OriginalThreeModelRenderer } from '../../gamebase-model-sync/character-model-renderer-mainmenu';
import CharacterModelRenderer from '../../gamebase-model-sync/character-model-renderer';

export const LoginSceneContent: React.FC = () => {
  const {
    playToken,
    setPlayToken,
    clearArcadeStorage,
  } = useArcadeStore();
  const {
    accessToken,
    setAccessToken,
    clearAuthStorage,
  } = useAuthStore();

  const [schoolCode, setSchoolCode] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [loginToken, setLoginToken] = useState(() => {
  //   return localStorage.getItem('access_token');
  // });
  // const [playToken, setPlayToken] = useState('');
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const [studentData, setStudentData] = useState<IGetDataResponse>({
    config_id: 0,
    model_data: { model_id: undefined },
    student_id: '',
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // 🔍 ตรวจสอบ playToken จาก URL query param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const playTokenFromUrl = urlParams.get('playToken');

    if (playTokenFromUrl) {
      console.log('🎮 Found playToken from URL:', playTokenFromUrl);
      setPlayToken(playTokenFromUrl);
    }
  }, [setPlayToken]);

  useEffect(() => {
    if (playToken !== '') {
      setPlayToken(playToken);
    }
  }, [playToken, setPlayToken]);

  useEffect(() => {
    if (playToken === '') return;

    const fetchStudentData = async () => {
      try {
        const res = await API.arcade.GetData({ play_token: playToken });
        if (res.status_code === 200) {
          setStudentData(res.data);
        } else if (res.status_code === 401) {
          // 🔐 Unauthorized - ให้ logout และ login ใหม่
          alert('⚠️ Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
          handleLogout();
        } else {
          alert(res.message);
        }
      } catch (err) {
        console.error('Get data error:', err);
        alert(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchStudentData();
  }, [playToken]);

  const redirectWithPlayToken = (newPlayToken: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: { [key: string]: string } = {};
    params['playToken'] = newPlayToken;
    searchParams.forEach((value, key) => {
      if (key !== 'playToken') {
        params[key] = value;
      }
    });

    const paramsArray = Object.entries(params).map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    );
    const joinedQuery = paramsArray.join("&");

    const newUrl = `${window.location.origin}${window.location.pathname}?${joinedQuery}`;
    console.log('🔄 Redirecting to:', newUrl);

    window.location.href = newUrl;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.auth.Login({
        school_code: schoolCode,
        student_id: studentId,
        pin: pin,
      });

      if (res.status_code === 200 && res.data.length > 0) {
        const token = res.data[0].access_token;
        setAccessToken(token);
        // setLoginToken(token);
        alert('✅ เข้าสู่ระบบสำเร็จ! กรุณาตรวจสอบ Session');
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    clearArcadeStorage();
    // setAccessToken('');
    // setPlayToken('');
    setIsChecked(false);

    // 🔄 Clear PlayToken from URL query params
    // const baseUrl = window.location.origin + window.location.pathname;
    // window.history.replaceState({}, document.title, baseUrl);
    redirectWithPlayToken('');
  };

  const handleBuyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBuying(true);
    try {
      const res = await API.arcade.BuyToken({ arcadeGameId: ARCADE_GAME_ID });
      if (res.status_code === 200) {
        const newPlayToken = res.data.play_token;
        setPlayToken(newPlayToken);

        // 🔄 Redirect พร้อม playToken
        if (newPlayToken) {
          redirectWithPlayToken(newPlayToken);
        }
      } else if (res.status_code === 401) {
        // 🔐 Unauthorized - ให้ logout และ login ใหม่
        alert('⚠️ Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
        handleLogout();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Buy token error:', err);
      alert(err instanceof Error ? err.message : 'Failed to buy token');
    } finally {
      setIsBuying(false);
    }
  };

  const handleCheckToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      // const res = await API.arcade.SessionCheck({ arcadeGameId: ARCADE_GAME_ID }, accessToken: loginToken || '');
      // const res = await API.arcade.SessionCheck({ arcadeGameId: ARCADE_GAME_ID }, playToken);
      const res = await API.arcade.SessionCheck({ arcadeGameId: ARCADE_GAME_ID }, accessToken || '');
      if (res.status_code === 200) {
        const newPlayToken = res.data.play_token || '';
        setPlayToken(newPlayToken);

        // 🔄 Redirect พร้อม playToken
        if (newPlayToken) {
          redirectWithPlayToken(newPlayToken);
        }
      } else if (res.status_code === 401) {
        // 🔐 Unauthorized - ให้ logout และ login ใหม่
        alert('⚠️ Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
        handleLogout();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error('Session check error:', err);
      alert(err instanceof Error ? err.message : 'Session check failed');
    } finally {
      setIsChecking(false);
      setIsChecked(true);
    }
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.arcade.SubmitResult({
        play_token: playToken,
        score,
        wave,
        time_used: timeUsed,
      });
      if (res.status_code === 200) {
        setPlayToken('');
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit result');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollableModal>
      {!accessToken ? (
        <form
          className="mx-be flex h-1/2 w-1/2 flex-col items-center justify-center gap-4 text-black"
          onSubmit={handleLogin}
        >
          <div className="flex w-2/3 flex-row items-center justify-between">
            <label className="text-base text-black" htmlFor="school-code">
              School Code:
            </label>
            <input
              className="w-2/3 border px-1"
              type="text"
              id="school-code"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value)}
              required
            />
          </div>
          <div className="flex w-2/3 flex-row items-center justify-between">
            <label className="text-base text-black" htmlFor="student-id">
              Student ID:
            </label>
            <input
              className="w-2/3 border px-1"
              type="text"
              id="student-id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="flex w-2/3 flex-row items-center justify-between">
            <label className="text-base text-black" htmlFor="pin">
              Pin:
            </label>
            <input
              className="w-2/3 border px-1"
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />
          </div>

          <button
            className="w-2/3 border text-base text-black"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-row items-center justify-center gap-8 py-4">
            <div>
              <div className="text-lg font-bold uppercase">Current Access Token:</div>
              <textarea
                className={'mt-2 max-w-full resize-x border border-gray-300 p-2'}
                name="access-token"
                id="access-token"
                value={accessToken || '-'}
                cols={50}
                rows={5}
                readOnly={true}
              />
            </div>
            <div>
              <div className="text-lg font-bold uppercase">Current Play Token:</div>
              <textarea
                className={'mt-2 max-w-full resize-x border border-gray-300 p-2'}
                name="play-token"
                id="play-token"
                value={playToken ?? ''}
                placeholder={'-'}
                cols={50}
                rows={5}
                readOnly={true}
              />
            </div>
          </div>
          <div className="grid h-1/3 w-full grid-cols-3 gap-2">
            <div className="flex w-full flex-col items-center gap-4 border py-8">
              <div className="text-center text-2xl font-bold uppercase">Buy Token</div>
              <button
                className="mt-4 w-1/3 border text-base text-black disabled:opacity-30"
                onClick={handleCheckToken}
              >
                {isChecking ? 'Checking...' : 'Check Session'}
              </button>
              <button
                className="mt-4 w-1/3 border text-base text-black disabled:opacity-30"
                onClick={handleBuyToken}
                hidden={playToken !== '' || !isChecked}
              >
                {isBuying ? 'Buying Token...' : 'Buy Token'}
              </button>
            </div>
            <div className="flex w-full flex-col items-center gap-4 border py-8">
              <div className="text-center text-2xl font-bold uppercase">Student INFO</div>
              {playToken != '' ? (
                <div className="flex flex-col items-center justify-center gap-4 py-2">
                  <div className="grid w-2/3 grid-cols-[auto_1fr] gap-2">
                    <span className="font-medium">User ID:</span>
                    <span>{studentData.student_id}</span>

                    <span className="font-medium">Model ID:</span>
                    <span>{studentData.model_data?.model_id}</span>

                    <span className="font-medium">Config ID:</span>
                    <span>{studentData.config_id}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-8 text-xl text-gray-300">No Play Token</div>
              )}
            </div>
            <div className="flex w-full flex-col items-center gap-4 border py-8">
              <div className="text-center text-2xl font-bold uppercase">
                Submit Result
              </div>
              <form
                className="mx-be flex w-1/2 flex-col items-center justify-center gap-4 py-2 text-black"
                onSubmit={handleSubmitResult}
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <label className="w-24 text-base text-black" htmlFor="score">
                    Score:
                  </label>
                  <input
                    className="w-2/3 border px-1"
                    type="number"
                    id="score"
                    value={score}
                    onChange={(e) => setScore(e.target.valueAsNumber)}
                    required
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <label className="w-24 text-base text-black" htmlFor="wave">
                    Wave:
                  </label>
                  <input
                    className="w-2/3 border px-1"
                    type="number"
                    id="wave"
                    value={wave}
                    onChange={(e) => setWave(e.target.valueAsNumber)}
                    required
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <label className="w-24 text-base text-black" htmlFor="time-used">
                    Time Used:
                  </label>
                  <input
                    className="w-2/3 border px-1"
                    type="number"
                    id="time-used"
                    value={timeUsed}
                    onChange={(e) => setTimeUsed(e.target.valueAsNumber)}
                    required
                  />
                </div>
                <button
                  className="w-full border text-base text-black disabled:opacity-30"
                  onClick={handleSubmitResult}
                  disabled={playToken === ''}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Result'}
                </button>
              </form>
            </div>
          </div>
          <button
            className="mt-8 w-48 border text-base text-black uppercase"
            onClick={handleLogout}
          >
            Log Out
          </button>
          {
            playToken !== null &&
            (
              <>
                <div className="mt-8 text-center text-2xl font-bold">
                  CloudModelViewer
                </div>
                <CloudModelViewer accessPlayToken={playToken} />
              </>
            )
          }
          {
            playToken !== null &&
            // studentData.model_data?.model_id &&
            (
              <div className="flex w-full flex-col items-center justify-center">
                <div className="mt-8 text-center text-2xl font-bold">
                  CharacterModelRenderer
                </div>

                {/* Ensure a visible area for the viewer */}
                <div className="w-full h-[600px] border border-blue-400/50 rounded-lg flex items-center justify-center">
                  <CharacterModelRenderer
                    accessPlayToken={playToken}
                    modelId={studentData.model_data?.model_id}
                    canvasWidth={900}
                    canvasHeight={560}
                  />
                </div>
              </div>
            )
          }

          {/* {
            playToken !== null &&
            (
              <>
                <div className="mt-8 text-center text-2xl font-bold">
                  ModelViewer
                </div>
                <ModelViewer accessPlayToken={playToken} />
              </>
            )
          }
          {
            studentData.model_data?.model_id &&
            (
              <div className="flex w-full flex-col items-center justify-center">
                <div className="mt-8 text-center text-2xl font-bold">
                  OriginalThreeModelRenderer
                </div>

                <OriginalThreeModelRenderer modelSrc={studentData.model_data?.model_id} />
              </div>
            )
          } */}
        </div>
      )}
    </ScrollableModal>
  );
};

export class SceneLogin extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.sceneInitial();
  }

  renderScene = () => {
    return <LoginSceneContent />;
  };
}
