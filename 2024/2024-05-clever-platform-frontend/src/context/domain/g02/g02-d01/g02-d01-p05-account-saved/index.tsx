import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ModalChangeLanguage from '@global/component/web/molecule/wc-m-modal-change-language';
import ModalSocialLogin from '@global/component/web/molecule/wc-m-modal-social-login';
import { cn } from '@global/helper/cn';
import StoreGame from '@global/store/game';
import StoreGlobalPersist, { UserPersistedData } from '@store/global/persist';
import ContainerRight from './component/web/templates/wc-a-container-right';
import Debug from './component/web/templates/wc-a-debug';
import ModalHiddenUser from './component/web/templates/wc-a-modal-hidden-user';
import ConfigJson from './config/index.json';
import styles from './index.module.css';
import { STATEFLOW } from './interfaces/stateflow.interface';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { userDatas } = StoreGlobalPersist.StateGet(['userDatas'])

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [showModalSocialLogin, setShowModalSocialLogin] = useState(false);
  const [showModalChangeLanguage, setShowModalChangeLanguage] = useState(false);
  const [showModalHiddenUser, setShowModalHiddenUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPersistedData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);
    setIsLoaded(true);
  }, []); // Make sure to provide an appropriate dependency array

  // handle when user click hide button from user list
  const handleClickHiddenUser = (student_id: string) => {
    const user = userDatas.find((user) => user.student_id === student_id);
    if (user) {
      setSelectedUser(user);
      setShowModalHiddenUser(true);
    }
  };

  // handle when user click accept to hide user modal
  const handleOnHideUser = () => {
    const userFilter = userDatas.filter(
      (user) => user.student_id !== selectedUser?.student_id,
    );
    if (userFilter.length !== 0) {
      StoreGlobalPersist.MethodGet().setUserData(userFilter[0]);
    } else {
      StoreGlobalPersist.MethodGet().setUserData(null);
    }
    StoreGlobalPersist.MethodGet().removeUserData(selectedUser?.student_id || null);
    setShowModalHiddenUser(false);
  };

  const handleClickAddUser = () => {
    navigate({ to: '/login-id', viewTransition: true });
  };

  const handleSelectUser = (student_id: string) => {
    const user = userDatas.find((user) => user.student_id === student_id);
    if (user) {
      StoreGlobalPersist.MethodGet().setUserData(user);
    }
    navigate({ to: '/pin', viewTransition: true });
  };

  const handleClickBack = () => {
    navigate({ to: '/account-select', viewTransition: true });
  };

  const isModalActive =
    showModalSocialLogin || showModalChangeLanguage || showModalHiddenUser;

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
        <ModalHiddenUser
          selectedUser={selectedUser}
          showModal={showModalHiddenUser}
          setShowModal={setShowModalHiddenUser}
          onOk={handleOnHideUser}
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
          className={cn(
            'absolute h-[calc(100%-130px)] w-[calc(100%-716px)] top-[68px] left-[22rem]',
            styles['transition-bottom-to-top'],
            isLoaded && styles['transition-bottom-to-top-loaded'],
          )}
        >
          <ContainerRight
            userList={userDatas}
            handleClickHiddenUser={handleClickHiddenUser}
            handleClickAddUser={handleClickAddUser}
            handleSelectUser={handleSelectUser}
            handleClickBack={handleClickBack}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
