import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ModalChangeLanguage from '@global/component/web/molecule/wc-m-modal-change-language';
import ModalSocialLogin from '@global/component/web/molecule/wc-m-modal-social-login';
import StoreGame from '@global/store/game';
import ContainerRight from './component/web/templates/wc-a-container-right';
import Debug from './component/web/templates/wc-a-debug';
import ConfigJson from './config/index.json';
import styles from './index.module.css';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { handleLogout } from '@global/helper/auth';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import { SecureStorage } from '@store/storage';
import API from '../local/api';
import { UserData } from '../local/type';
import ModalForgotPin from './component/web/templates/wc-a-modal-forgot-pin';
import { STATEFLOW } from './interfaces/stateflow.interface';
import StoreSubjects from '@store/global/subjects';

const DomainJSX = () => {
  const navigate = useNavigate();

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const { userDatas } = StoreGlobalPersist.StateGet(['userDatas']) as {
    userDatas: UserData[];
  };

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [showModalSocialLogin, setShowModalSocialLogin] = useState(false);
  const [showModalChangeLanguage, setShowModalChangeLanguage] = useState(false);
  const [showModalForgotPin, setShowModalForgotPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [warningText, setWarningText] = useState('');

  const loginWithPin = async (student_id: string, school_code: string, pin: string) => {
    return await API.Auth.LoginWithPin({
      pin,
      student_id,
      school_code,
    });
  };

  const clearStore = async () => {
    StoreGlobalPersist.MethodGet().clearFields('accessToken', 'adminId', 'adminFullname');
    StoreSubjects.MethodGet().clearAll();
  };

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');

    setPin('');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (pin.length === 4 && userData) {
      async function handlePinCheck() {
        const loginWithPinResponse = await loginWithPin(
          userData.student_id,
          userData.school_code,
          pin,
        );

        switch (loginWithPinResponse.status_code) {
          case 200:
            // clear store
            await clearStore();
            // if we can get the response from our API (online mode)
            // check if the response is 200
            const { access_token, ...user } = loginWithPinResponse.data;
            StoreGlobalPersist.MethodGet().updateAccessToken(access_token);
            StoreGlobalPersist.MethodGet().setUserData({
              ...user,
              temp_image: userData.temp_image,
            });
            // keep this data to using on submit played levels
            // after playing in offline mode
            const userAndPin = {
              pin,
              ...user,
            };

            SecureStorage.setItem('user', userAndPin);

            setTimeout(() => {
              navigate({ to: '/terms', replace: true, viewTransition: true });
            }, 100);
            break;
          case 404:
            setWarningText(t('not_found'));
            break;
          case 401:
            setWarningText(t('wrong_pin'));
            break;
          default:
            setWarningText(t('error'));
        }
      }

      handlePinCheck();
      setPin('');
    }
  }, [pin, userData?.student_id]);

  useEffect(() => {
    if (userDatas.length === 0) {
      navigate({ to: '/login-id', viewTransition: true, replace: true });
    }

    if (!userData && userDatas.length > 0) {
      StoreGlobalPersist.MethodGet().setUserData(userDatas[0]);
    }
  }, [userDatas, userData]);

  const handleClickPin = (number: number) => {
    setPin((prev) => {
      if (prev.length < 4) {
        return prev + number;
      }
      return prev;
    });
  };

  const handleDeletePin = () => {
    setPin((prev) => {
      return prev.slice(0, -1);
    });
  };

  const handleClickSwap = () => {
    navigate({ to: '/accounts-saved', viewTransition: true });
  };

  const handleClickBack = () => {
    navigate({ to: '/account-select', viewTransition: true });
  };

  const handleForgotPin = () => {
    setShowModalForgotPin(true);
  };

  const isModalActive =
    showModalSocialLogin || showModalChangeLanguage || showModalForgotPin;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9') {
        const number = parseInt(event.key);
        handleClickPin(number);
      } else if (event.key === 'Backspace') {
        handleDeletePin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 body"
    >
      <SafezonePanel
        className={`relative inset-0 h-full w-full ${isModalActive ? 'z-50' : ''}`}
      >
        <ModalSocialLogin
          showModal={showModalSocialLogin}
          setShowModal={setShowModalSocialLogin}
        />
        <ModalChangeLanguage
          showModal={showModalChangeLanguage}
          setShowModal={setShowModalChangeLanguage}
        />
        <ModalForgotPin
          showModal={showModalForgotPin}
          setShowModal={setShowModalForgotPin}
        />
      </SafezonePanel>
      <SafezonePanel className="relative inset-0 bg-white bg-opacity-0 text-black h-full w-full">
        <Debug />
        {/* <div className="absolute h-[calc(100%-220px)] w-[calc(100%-580px)] top-[120px] left-[30px]">
              <ContainerLeft
                setShowModalSocialLogin={setShowModalSocialLogin}
                setShowModalChangeLanguage={setShowModalChangeLanguage}
              />
            </div> */}
        <div
          className={`absolute h-[calc(100%-100px)] w-[calc(100%-716px)] top-[52px] left-[22rem] ${styles['transition-bottom-to-top']} ${
            isLoaded ? `${styles['transition-bottom-to-top-loaded']}` : ''
          }`}
        >
          <ContainerRight
            pin={pin}
            currentUser={userData}
            warningText={warningText}
            handleClickPin={handleClickPin}
            handleDeletePin={handleDeletePin}
            handleClickSwap={handleClickSwap}
            handleClickBack={handleClickBack}
            handleForgotPin={handleForgotPin}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
