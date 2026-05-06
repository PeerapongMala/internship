import { useTranslation } from 'react-i18next';

import ModalBackgroudA from '@global/component/web/organism/wc-o-modal-backgroud-a';
import StoreGame from '@global/store/game';
import { useMemo } from 'react';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
import AdminBody from '../organisms/wc-a-admin-body';
import Body from '../organisms/wc-a-body';
import Header from '../organisms/wc-a-header';

const ContainerRight = ({
  schoolID,
  setSchoolID,
  userID,
  setUserID,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  handleNext,
  handleAdminNext,
  inputFailed,
  offLineMode,
  handleToggleInternet,
  handleClickBack,
  handleAdminClickBack,
  setShowModal,
}: {
  schoolID: string;
  setSchoolID: (value: string) => void;
  userID: string;
  setUserID: (value: string) => void;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  adminPassword: string;
  setAdminPassword: (value: string) => void;
  handleNext: () => void;
  inputFailed: boolean;
  handleAdminNext: () => void;
  offLineMode: boolean;
  handleToggleInternet: any;
  handleClickBack: any;
  handleAdminClickBack: () => void;
  setShowModal: any;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const isAdminMode =
    stateFlow === STATEFLOW.AdminEmail ||
    stateFlow === STATEFLOW.AdminPassword ||
    stateFlow === STATEFLOW.AdminSchoolID ||
    stateFlow === STATEFLOW.AdminUserID;

  const headerTitle = useMemo(() => {
    if (stateFlow === STATEFLOW.AdminEmail || stateFlow === STATEFLOW.AdminPassword)
      return t('login_admin');
    return t('login');
  }, [stateFlow, t]);

  return (
    <div className="relative h-full w-full">
      <ModalBackgroudA />
      <Header
        onClick={isAdminMode ? handleAdminClickBack : handleClickBack}
        showBack={stateFlow !== STATEFLOW.SchoolID}
        title={headerTitle}
      />
      {isAdminMode ? (
        <AdminBody
          schoolID={schoolID}
          setSchoolID={setSchoolID}
          userID={userID}
          setUserID={setUserID}
          adminEmail={adminEmail}
          setAdminEmail={setAdminEmail}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          handleAdminNext={handleAdminNext}
          inputFailed={inputFailed}
          offLineMode={offLineMode}
          handleToggleInternet={handleToggleInternet}
        />
      ) : (
        <Body
          schoolID={schoolID}
          setSchoolID={setSchoolID}
          userID={userID}
          setUserID={setUserID}
          handleNext={handleNext}
          inputFailed={inputFailed}
          offLineMode={offLineMode}
          handleToggleInternet={handleToggleInternet}
        />
      )}
    </div>
  );
};

export default ContainerRight;
