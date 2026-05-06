import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ButtonBack from '@component/web/atom/wc-a-button-back';
import WCAGuardedRoute from '@component/web/atom/wc-a-guarded-route';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import ModalBackgroudB from '@component/web/organism/wc-o-modal-backgroud-b';
import Button from '@global/component/web/atom/wc-a-button';
import { useOnlineStatus } from '@global/helper/online-status';
import { createSoundController, SoundController } from '@global/helper/sound';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import ImageArrowRight from './assets/arrow-glyph-right.svg';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';

enum STATEFLOW {
  Input = 0,
  Success = 1,
  Fail = 2,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [schoolID, setSchoolID] = useState('');
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // online status
  const [showModalOfflineWarning, setShowModalOfflineWarning] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []); // Make sure to provide an appropriate dependency array

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const navigate = useNavigate();

  const handleBack = () => {
    if (stateFlow == STATEFLOW.Input) navigate({ to: '/main-menu' });
    else StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
    // navigate({ to: '/main-menu' });
  };

  const handleNext = async () => {
    if (stateFlow === STATEFLOW.Input || stateFlow === STATEFLOW.Fail) {

      if (!schoolID.trim()) {
        return;
      }

      if (!isOnline) {
        setShowModalOfflineWarning(true);
        return;
      }

      try {
        StoreGlobal.MethodGet().loadingSet(true);
        const res = await API.redeem.redeemCoupon(schoolID);

        if (res && res.status_code === 200) {
          setErrorMessage(null);
          StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Success);
        } else if (res.status_code === 404) {
          const message = t('redeem_code_incorrect');
          setErrorMessage(message);
          StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Fail);
        } else if (res.status_code === 409) {
          const message = t('redeem_code_already_used');
          setErrorMessage(message);
          StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Fail);
        }
      } catch (error) {

        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Fail);
      } finally {
        StoreGlobal.MethodGet().loadingSet(false);
      }
    } else if (stateFlow === STATEFLOW.Fail) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
    }
  };

  const handleRetryOffline = () => {
    StoreGlobal.MethodGet().loadingSet(true);
    new Promise((resolve) => {
      // wait for a sec for given a feedback
      // that we are retrying to connect
      setTimeout(
        () => {
          // if the user back to online, hide the offline warning modal
          if (isOnline) setShowModalOfflineWarning(false);
          resolve(true);
        },
        500 + (-250 + Math.random() * 500),
      );
    }).finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    });
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

  return (
    <WCAGuardedRoute redirectPath="/redeem">
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0 text-black">
          {(stateFlow == STATEFLOW.Input || stateFlow == STATEFLOW.Fail) && (
            <div style={dialogStyle}>
              <ModalBackgroudB />
              <HeaderJSX handleBack={handleBack} />
              <BodyJSX
                // placeholder="กรอกโค้ดรับรางวัล..."
                placeholder={t('redeem_placeholder')}
                inputValue={schoolID}
                setInputValue={setSchoolID}
                errorMessage={errorMessage}
              />
              <FooterJSX handleNext={handleNext} />
            </div>
          )}

          {stateFlow == STATEFLOW.Success && (
            <div style={dialogStyle}>
              <ModalBackgroudB />
              <HeaderSuccessJSX />
              <BodySuccessJSX />
              <FooterSuccessJSX
                handleNext={() => {
                  navigate({ to: '/avatar-custom', viewTransition: true });
                }}
              />
            </div>
          )}
        </SafezonePanel>
        <ModalOffLineWarning
          overlay={true}
          isVisible={showModalOfflineWarning}
          setVisible={setShowModalOfflineWarning}
          onOk={handleRetryOffline}
          enablePlayOffline={false}
        />
      </ResponsiveScaler>
    </WCAGuardedRoute>
  );
};

const HeaderJSX = ({ handleBack }: { handleBack: () => void }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div className="flex justify-start items-center self-stretch h-24 px-4 border-b-2 border-dashed border-secondary relative">
      <ButtonBack
        onClick={handleBack}
        className="absolute w-14 h-14 left-[1.5rem] cursor-pointer"
      />
      <div className="flex-1 text-center text-gray-800 text-3xl font-bold">
        {/* กรอกโค้ดรับรางวัล */}
        {t('redeem_header')}
      </div>
    </div>
  );
};

const HeaderSuccessJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const handleBack = () => {
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
  };

  return (
    <div className="flex justify-start items-center self-stretch h-24 px-4 border-b-2 border-dashed border-secondary relative">
      <ButtonBack
        className="absolute w-14 h-14 left-[1.5rem] cursor-pointer"
        onClick={handleBack}
      />
      <div className="flex-1 text-center text-gray-800 text-3xl font-bold">
        {/* สำเร็จ ได้รับรางวัลเเล้ว */}
        {t('reward_received')}
      </div>
    </div>
  );
};

const BodyJSX = ({
  placeholder,
  inputValue,
  setInputValue,
  errorMessage
}: {
  placeholder: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  errorMessage: string | null
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
  }, [inputValue.length]);

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
  return (
    <div className="flex flex-col items-center p-8 gap-8 self-stretch border-b-2 border-dashed border-secondary">
      <input
        className={`w-full h-20 border-2 rounded-full pr-4 text-center text-3xl focus:outline-none bg-white ${errorMessage ? 'border-red-500 focus:border-red-500' : 'border-secondary focus:border-secondary'
          }`}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      {errorMessage && (
        <div className="text-red-500 text-center text-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const BodySuccessJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex flex-col items-center p-8 gap-8 self-stretch border-b-2 border-dashed border-secondary">
      <div className="flex-1 text-center text-gray-800 text-3xl ">
        {/* รางวัลของคุณถูกกส่งไปยังคลังเก็บของแล้ว */}
        {t('sent_to_inventory')}
      </div>
    </div>
  );
};

const FooterJSX = ({ handleNext }: { handleNext: () => void }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex flex-col pt-4 px-12 justify-start items-center self-stretch border-none outline-none">
      <ButtonNext onClick={handleNext} text={t('redeem_confirm')} />
      <div className="flex justify-center gap-4 text-gray-800 text-xl py-4"></div>
    </div>
  );
};

const FooterSuccessJSX = ({ handleNext }: { handleNext: () => void }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  return (
    <div className="flex flex-col py-4 px-12 justify-start items-center self-stretch border-none outline-none">
      {/* คลังเก็บของ */}
      <ButtonNext onClick={handleNext} text={t('inventory')} />
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

export default DomainJSX;
