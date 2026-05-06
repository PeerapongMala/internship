import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ModalChangeLanguage from '@global/component/web/molecule/wc-m-modal-change-language';
import ModalOfflineConfirm from '@global/component/web/molecule/wc-m-modal-offline-confirm';
import ModalSocialLogin from '@global/component/web/molecule/wc-m-modal-social-login';
import StoreGame from '@global/store/game';
// import ContainerLeft from './component/web/templates/wc-a-container-left';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import StoreGlobalPersist from '@store/global/persist';
import { UserData } from '../local/type';
import ContainerRight from './component/web/templates/wc-a-container-right';
import Debug from './component/web/templates/wc-a-debug';
import ConfigJson from './config/index.json';
import styles from './index.module.css';
import { STATEFLOW } from './interfaces/stateflow.interface';

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
  const [showModalOfflineMode, setShowModalOfflineMode] = useState(false);
  const [offLineMode, setOffLineMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (userDatas.length === 0) {
      navigate({ to: '/login-id', viewTransition: true });
    }
  }, [userDatas]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);
    setIsLoaded(true);
  }, []); // Make sure to provide an appropriate dependency array

  const handleToggleInternet = () => {
    if (offLineMode) {
      setOffLineMode(false);
    } else {
      setShowModalOfflineMode(true);
    }
  };

  const handleOk = () => {
    setShowModalOfflineMode(false);
    setOffLineMode(true);
  };

  const handleClickSwap = () => {
    navigate({ to: '/accounts-saved' });
  };

  const handleClickStart = () => {
    navigate({ to: '/pin' });
  };

  const isModalActive =
    showModalSocialLogin || showModalChangeLanguage || showModalOfflineMode;

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 body"
    >
      {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10"></div>}
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
        <ModalOfflineConfirm
          showModal={showModalOfflineMode}
          setShowModal={setShowModalOfflineMode}
          onOk={handleOk}
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
          className={`absolute h-[calc(100%-190px)] w-[calc(100%-716px)] top-[96px] left-[22rem] ${styles['transition-bottom-to-top']} ${isLoaded ? `${styles['transition-bottom-to-top-loaded']}` : ''
            }`}
        >
          <ContainerRight
            offLineMode={offLineMode}
            handleToggleInternet={handleToggleInternet}
            selectedUser={userData}
            handleClickSwap={handleClickSwap}
            handleClickStart={handleClickStart}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
