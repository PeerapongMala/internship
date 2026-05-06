import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ButtonBack from '@component/web/atom/wc-a-button-back';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import Button from '@global/component/web/atom/wc-a-button';
import ModalBackgroudA from '@global/component/web/organism/wc-o-modal-backgroud-a';
import { createSoundController, SoundController } from '@global/helper/sound';
import StoreGame from '@global/store/game';
import StoreGlobalPersist from '@store/global/persist';
import API from '../local/api';
import { CheckCode, CheckSchool } from '../local/type';
import ImageArrowRight from './assets/arrow-glyph-right.svg';
import ImageBGLogin from './assets/background-login.jpg';
import ImageButtonContact from './assets/button-contact.png';
import ImageButtonTryAgain from './assets/button-try-again.png';
import ImageCheckSuccess from './assets/check-success.png';
import ImageToggleBackgroudInternet from './assets/toggle-internet-background.png';
import ImageToggleInternet from './assets/toggle-internet.png';
import ImageToggleBackgroudNoInternet from './assets/toggle-no-internet-background.png';
import ImageToggleNoInternet from './assets/toggle-no-internet.png';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';

enum STATEFLOW {
  SchoolID = 1,
  UserID = 2,
  Pin = 3,
  Success = 4,
  SchoolFail = 5,
  UserFail = 6,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const [schoolID, setSchoolID] = useState<string>('');
  const [userID, setUserID] = useState('');
  const [pin, setPin] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const provider = localStorage.getItem('provider') as 'line' | 'google' | null;
  const [lineToken, setLineToken] = useState<CheckCode>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUI, setShowUI] = useState(true);
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
  }, []); // Make sure to provide an appropriate dependency array

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  useEffect(() => {
    if (code && provider) {
      setLoading(true);
      setShowUI(false);
      API.Auth.CheckAuthWithProvider(provider, code)
        .then((res) => {
          if (res.status_code === 400) {
            alert(
              `โปรดทำการเข้าสู่ระบบ${provider === 'line' ? 'ไลน์' : 'Google'}อีกครั้ง`,
            );
            navigate({ to: '/login-id' });
          }
          const data = res.data as CheckCode;
          if (data) {
            setLineToken(data);
          } else {
            console.error('Response data is undefined');
          }
        })
        .catch((err) => {
          console.error(`Error fetching ${provider} auth:`, err);
        })
        .finally(() => {
          setLoading(false);
          setShowUI(true);
        });
    }
  }, []);

  useEffect(() => {
    if (lineToken && provider) {
      setLoading(true);
      setShowUI(false);
      API.Auth.CheckBindProvider(provider, lineToken)
        .then((res) => {
          if (res.status_code === 200) {
            const { access_token, ...user } = res.data;
            StoreGlobalPersist.MethodGet().updateAccessToken(access_token);
            StoreGlobalPersist.MethodGet().setUserData(user);
            handleOnSuccessLogin();
          } else if (res.status_code === 404) {
            console.log('กรุณาผูกบัญชี');
            // alert('กรุณาผูกบัญชี');
          }
        })
        .catch((err) => {
          console.error('Error binding provider:', err);
        })
        .finally(() => {
          setLoading(false);
          setShowUI(true);
        });
    }
  }, [lineToken]);

  const handleCheckSchoolId = () => {
    if (schoolID && schoolID.trim() !== '') {
      setLoading(true);

      API.Auth.CheckSchoolId(schoolID)
        .then((res) => {
          const data = res.data as CheckSchool;
          if (data.is_exists === true) {
            StoreGame.MethodGet().State.Flow.Set(STATEFLOW.UserID);
          } else {
            StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolFail);
          }
        })
        .catch((err) => {
          console.error('Error checking school ID:', err);
          StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolFail);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      alert('โปรดกรอกรหัสโรงเรียน');
      console.error('School ID cannot be empty');
      setLoading(false);
    }
  };

  const handleBindLogin = async () => {
    if (!schoolID || !userID || !pin) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (!lineToken) {
      alert('โปรดทำการเข้าสู่ระบบไลน์ใหม่อีกครั้ง');
      navigate({ to: '/login-id' });
      return;
    }
    if (!provider) {
      alert('โปรดทำการเข้าสู่ระบบใหม่อีกครั้ง');
      navigate({ to: '/login-id' });
      return;
    }
    const requestData = {
      school_code: schoolID,
      student_id: userID,
      pin: pin,
      provider_access_token: lineToken.provider_access_token,
    };

    try {
      const res = await API.Auth.BindLogin(provider, requestData);

      // todo: modal error
      if (res.status_code === 404) {
        alert('รหัสนักเรียนไม่ถูกต้อง');
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
        return;
      }
      if (res.status_code === 409) {
        alert('เลขนักเรียนนี้ได้ทำการผูกบัญชีแล้ว');
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.UserFail);
        return;
      }
      if (res.status_code === 500) {
        console.error('Login error:', res);
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ ');
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.UserFail);
        return;
      }

      // Success
      // todo: maybe we should fetch user data again from backend
      StoreGlobalPersist.MethodGet().updateAccessToken(lineToken.provider_access_token);
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Success);
    } catch (error) {
      console.error('Error in BindLogin:', error);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.UserFail);
    }
  };

  const handleNext = () => {
    if (stateFlow === STATEFLOW.SchoolID) {
      if (!userID) {
        setErrorMessage('โปรกรอกรหัสโรงเรียน');
        return;
      }
      setErrorMessage('');
      handleCheckSchoolId();
    }
    if (stateFlow == STATEFLOW.UserID) {
      // if (userID.length > 5) {
      //   setErrorMessage('รหัสผู้ใช้งานต้องไม่เกิน 5 ตัวอักษร');
      //   return;
      // }
      // if (userID.length < 5) {
      //   setErrorMessage('โปรดกรอกรหัสผู้ใช้งานให้ครบ 5 ตัวอักษร');
      //   return;
      // }

      if (userID !== '') {
        setErrorMessage('');
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Pin);
      }
    }
    if (stateFlow == STATEFLOW.Pin) {
      if (pin.length > 4) {
        setErrorMessage('PIN ต้องไม่เกิน 4 ตัวอักษร');
        return;
      }
      if (pin !== '') {
        setErrorMessage('');
        handleBindLogin();
      }
    }
    if (stateFlow == STATEFLOW.UserFail) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.SchoolID);
    }
  };

  const handleOnSuccessLogin = () => {
    navigate({ to: '/terms', replace: true, viewTransition: true });
  };

  const dialogStyle: React.CSSProperties = {
    // width: `${374 * multipleScale}px`,
    // height: `${220 * multipleScale}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '732px',
    gap: '16px',
    fontFamily: 'Noto Sans Thai',

    padding: '8px 8px 16px 8px',
  };

  // const dashedStyleURL =
  //   "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e";
  // const dashedStyle: React.CSSProperties = {
  //   backgroundImage: dashedStyleURL,
  //   padding: '20px',
  //   display: 'inline-block',
  // };

  const LoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        <p className="ml-4 text-white text-xl">กำลังตรวจสอบข้อมูล...</p>
      </div>
    );
  };

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>

      {loading && <LoadingSpinner />}

      {showUI && (
        <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0 text-black">
          {(stateFlow == STATEFLOW.SchoolID || stateFlow == STATEFLOW.SchoolFail) && (
            <div style={dialogStyle}>
              <ModalBackgroudA />
              <HeaderJSX />
              <BodyJSX
                // placeholder="กรอกรหัสโรงเรียน..."
                placeholder={t('placeholder_school')}
                inputValue={schoolID}
                setInputValue={setSchoolID}
                errorMessage={errorMessage}
              />
              <FooterJSX
                handleNext={handleNext}
                handleCheckSchoolId={handleCheckSchoolId}
                stateFlow={stateFlow}
              />
            </div>
          )}

          {stateFlow == STATEFLOW.UserID && (
            <div style={dialogStyle}>
              <ModalBackgroudA />
              <HeaderJSX />
              <BodyJSX
                // placeholder="กรอกรหัสผู้ใช้งาน..."
                placeholder={t('placeholder_user')}
                inputValue={userID}
                setInputValue={setUserID}
                errorMessage={errorMessage}
              />
              <FooterJSX
                handleNext={handleNext}
                handleCheckSchoolId={handleCheckSchoolId}
                stateFlow={stateFlow}
              />
            </div>
          )}

          {stateFlow == STATEFLOW.Pin && (
            <div style={dialogStyle}>
              <ModalBackgroudA />
              <HeaderJSX />
              <BodyJSX
                // placeholder="กรอกพิน..."
                placeholder={t('placeholder_pin')}
                inputValue={pin}
                setInputValue={setPin}
                errorMessage={errorMessage}
              />
              <FooterJSX
                handleNext={handleNext}
                handleCheckSchoolId={handleCheckSchoolId}
                stateFlow={stateFlow}
              />
            </div>
          )}

          {stateFlow == STATEFLOW.Success && (
            <div style={dialogStyle}>
              <ModalBackgroudA />
              <HeaderSuccessJSX />
              <BodySuccessJSX />
              <FooterSuccessJSX handleNext={handleOnSuccessLogin} />
            </div>
          )}

          {stateFlow == STATEFLOW.UserFail && (
            <div style={dialogStyle}>
              <ModalBackgroudA />
              <HeaderFailJSX />
              <BodyFailJSX />
              <FooterFailJSX handleNext={handleNext} />
            </div>
          )}
        </SafezonePanel>
      )}
    </ResponsiveScaler>
  );
};

const HeaderJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const navigate = useNavigate();
  const handleBack = () => {
    if (stateFlow === STATEFLOW.SchoolID || stateFlow === STATEFLOW.SchoolFail) {
      navigate({ to: '/login-id' });
      return;
    }
    if (stateFlow > STATEFLOW.SchoolID) {
      StoreGame.MethodGet().State.Flow.Set(stateFlow - 1);
    }
  };

  return (
    <div className="flex justify-start items-center self-stretch h-24 px-4 border-b-2 border-dashed border-secondary relative">
      <ButtonBack onClick={handleBack} className="absolute w-14 h-14" />
      <div className="flex-1 text-center text-gray-800 text-3xl font-bold">
        {/* กรุณาผูกบัญชี */}
        {t('plase_link_your_account')}
      </div>
    </div>
  );
};

const BodyJSX = ({
  placeholder,
  inputValue,
  setInputValue,
  errorMessage,
}: {
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  errorMessage: string;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const soundControllerRef = useRef<SoundController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevLengthRef = useRef<number>(0);

  useEffect(() => {
    soundControllerRef.current = createSoundController('typing_game', {
      autoplay: false,
      loop: true,
      volume: 'sfx',
    });
    prevLengthRef.current = inputValue.length;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (soundControllerRef.current) {
        soundControllerRef.current.stop();
        soundControllerRef.current.destory();
        soundControllerRef.current = null;
      }
    };
  }, []);

  const stopTypingSound = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (soundControllerRef.current) {
        soundControllerRef.current.stop();
      }
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newLength = newValue.length;
    if (newLength !== prevLengthRef.current && soundControllerRef.current) {
      soundControllerRef.current.play();
      stopTypingSound();
    }
    prevLengthRef.current = newLength;

    setInputValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') &&
      soundControllerRef.current
    ) {
      soundControllerRef.current.play();
      stopTypingSound();
    }
  };

  const handleBlur = () => {
    if (soundControllerRef.current) {
      soundControllerRef.current.stop();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const state =
    stateFlow == STATEFLOW.SchoolID || stateFlow == STATEFLOW.SchoolFail
      ? '1'
      : stateFlow == STATEFLOW.UserID
        ? '2'
        : '3';

  return (
    <div className="flex flex-col items-center p-8 gap-8 self-stretch border-b-2 border-dashed border-secondary">
      <div className="flex-1 text-center text-gray-800 text-3xl ">
        {t('link_social_account_with_clever')}
      </div>
      <div className="flex items-center gap-2 w-full rounded-full border-2 border-secondary bg-secondary">
        <div className="text-center text-gray-800 text-3xl font-bold px-7">{state}/3</div>
        <input
          className={`w-full h-20 border-2 rounded-r-full pr-4 text-center text-3xl focus:outline-none bg-white ${stateFlow == 5
            ? 'border-red-500 focus:border-red-500'
            : 'border-secondary focus:border-secondary'
            }`}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
      {stateFlow == 5 && (
        <div className="text-red-500 text-center text-xl">
          {t('school_code_incorrect_please_try_again')}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-500 mt-2 text-center text-xl">{errorMessage}</div>
      )}
    </div>
  );
};

const FooterJSX = ({
  handleNext,
  handleCheckSchoolId,
  stateFlow,
}: {
  handleNext: () => void;
  handleCheckSchoolId: () => void;
  stateFlow: STATEFLOW;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex justify-center items-center gap-4">
      {stateFlow === STATEFLOW.SchoolID || stateFlow === STATEFLOW.SchoolFail ? (
        <Button onClick={handleCheckSchoolId}>{t('next')}</Button>
      ) : null}

      {stateFlow == STATEFLOW.UserID || stateFlow == STATEFLOW.Pin ? (
        <Button onClick={handleNext}>{t('next')}</Button>
      ) : null}
    </div>
  );
};

const HeaderSuccessJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col justify-start items-center self-stretch h-36 px-4 border-b-2 border-dashed border-secondary relative pt-4">
      <div>
        <img className="icon h-20" src={ImageCheckSuccess} />
      </div>
      <div className="flex-1 text-center text-gray-800 text-3xl font-bold">
        {/* ผูกบัญชีสำเร็จ */}
        {t('link_account_success')}
      </div>
    </div>
  );
};

const BodySuccessJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked((prev) => {
      return !prev;
    });
  };
  return (
    <div className="flex flex-col items-center p-8 gap-8 self-stretch border-b-2 border-dashed border-secondary">
      <div className="flex-1 p-6 text-center text-gray-800 bg-white rounded-3xl">
        <div className="font-bold text-3xl">
          {/* <span className="underline">ปิด</span>โหมดเล่นแบบออฟไลน์ */}
          <span className="underline">{t('close')}</span>
          {t('offline_mode')}
        </div>
        <div className="flex gap-4">
          <ToggleButtonInternet isChecked={isChecked} onChange={handleCheckboxChange} />
          {/* <div className="text-2xl text-start">
            ใช้โหมดนี้ หากอุปกรณ์เครื่องนี้
            <div className="font-bold">ไม่ใช่อุปกรณ์ส่วนตัว</div>
          </div> */}
          <div className="text-2xl text-start">
            {t('use_this_mode_if_this_device')}
            <div className="font-bold">{t('not_personal_device')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterSuccessJSX = ({ handleNext }: { handleNext: () => void }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex flex-col py-4 px-12 justify-start items-center self-stretch border-none outline-none">
      <ButtonNext onClick={handleNext} text={t('login')} />
    </div>
  );
};

const HeaderFailJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex justify-start items-center self-stretch h-24 px-4 border-b-2 border-dashed border-secondary relative">
      <div className="flex-1 text-center text-gray-800 text-3xl font-bold">
        {/* ไม่สามารถผูกบัญชีได้ */}
        {t('cant_link_account')}
      </div>
    </div>
  );
};

const BodyFailJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col items-center text-2xl self-stretch p-8 gap-2 border-b-2 border-dashed border-secondary">
      {/* <div>รหัสโรงเรียน / รหัสผู้ใช้งานไม่ถูกต้อง</div>
      <div>กรุณาลองอีกครั้ง หรือติดต่อแอดมิน</div> */}
      <div>{t('school_user_code_incorrect')}</div>
      <div>{t('please_try_again_or_contact_admin')}</div>
    </div>
  );
};

const FooterFailJSX = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <div className="flex pt-4 gap-4 justify-center w-full">
      <div className="cursor-pointer" onClick={handleNext}>
        <img src={ImageButtonTryAgain} />
      </div>
      <div className="cursor-pointer">
        <img src={ImageButtonContact} />
      </div>
    </div>
  );
};

const ButtonNext = ({ onClick, text }: { onClick: () => void; text?: string }) => {
  return (
    <Button
      suffix={<img src={ImageArrowRight} className="w-12 pr-3" />}
      className="w-full"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

const ToggleButtonInternet = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
          className="sr-only"
        />
        <div className="block h-14">
          <img
            className="icon h-full w-full object-cover"
            src={
              isChecked ? ImageToggleBackgroudNoInternet : ImageToggleBackgroudInternet
            }
            alt={isChecked ? 'No Internet BG Icon' : 'Internet BG Icon'}
          />
        </div>
        <div
          className={`dot absolute left-1 top-1 h-10 w-10 rounded-full bg-white m-1 transition ${isChecked ? 'translate-x-8' : ''
            }`}
        >
          <img
            className="icon h-full w-full object-cover"
            src={isChecked ? ImageToggleNoInternet : ImageToggleInternet}
            alt={isChecked ? 'No Internet Icon' : 'Internet Icon'}
          />
        </div>
      </div>
    </label>
  );
};

export default DomainJSX;
