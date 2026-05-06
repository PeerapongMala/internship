import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@global/component/web/atom/wc-a-button';
import ButtonInputStep from '@global/component/web/atom/wc-a-button-input-step';
import ToggleInternet from '@global/component/web/molecule/wc-m-toggle-internet';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const AdminBody = ({
  schoolID,
  setSchoolID,
  userID,
  setUserID,
  adminEmail,
  setAdminEmail,
  adminPassword,
  setAdminPassword,
  handleAdminNext,
  inputFailed,
  offLineMode,
  handleToggleInternet,
}: {
  schoolID: string;
  setSchoolID: (value: string) => void;
  userID: string;
  setUserID: (value: string) => void;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  adminPassword: string;
  setAdminPassword: (value: string) => void;
  handleAdminNext: () => void;
  inputFailed: boolean;
  offLineMode: boolean;
  handleToggleInternet: () => void;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { t } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleAdminNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAdminNext]);

  const placeholder = useMemo(() => {
    if (stateFlow === STATEFLOW.AdminEmail) return t('placeholder_admin_email');
    if (stateFlow === STATEFLOW.AdminPassword) return t('placeholder_admin_password');
    if (stateFlow === STATEFLOW.AdminSchoolID) return t('placeholder_school');
    if (stateFlow === STATEFLOW.AdminUserID) return t('placeholder_user');
    return '';
  }, [stateFlow, t]);

  const invalidText = useMemo(() => {
    if (inputFailed) {
      if (stateFlow === STATEFLOW.AdminEmail)
        return t('admin_email_incorrect_please_try_again');
      if (stateFlow === STATEFLOW.AdminPassword)
        return t('admin_email_or_password_incorrect_please_try_again');
      if (stateFlow === STATEFLOW.AdminSchoolID)
        return t('school_code_incorrect_please_try_again');
      if (stateFlow === STATEFLOW.AdminUserID)
        return t('user_code_incorrect_please_try_again');
    }
    return '';
  }, [inputFailed, stateFlow, t]);

  const step = useMemo(() => {
    if (stateFlow === STATEFLOW.AdminEmail) return '1/4';
    if (stateFlow === STATEFLOW.AdminPassword) return '2/4';
    if (stateFlow === STATEFLOW.AdminSchoolID) return '3/4';
    if (stateFlow === STATEFLOW.AdminUserID) return '4/4';
    return '';
  }, [stateFlow]);

  const inputValue = useMemo(() => {
    if (stateFlow === STATEFLOW.AdminEmail) return adminEmail;
    if (stateFlow === STATEFLOW.AdminPassword) return adminPassword;
    if (stateFlow === STATEFLOW.AdminSchoolID) return schoolID;
    if (stateFlow === STATEFLOW.AdminUserID) return userID;
    return '';
  }, [stateFlow, adminEmail, adminPassword, schoolID, userID]);

  const onInputChange = useMemo(() => {
    if (stateFlow === STATEFLOW.AdminEmail) return setAdminEmail;
    if (stateFlow === STATEFLOW.AdminPassword) return setAdminPassword;
    if (stateFlow === STATEFLOW.AdminSchoolID) return setSchoolID;
    if (stateFlow === STATEFLOW.AdminUserID) return setUserID;
    return () => {};
  }, [stateFlow, setAdminEmail, setAdminPassword, setSchoolID, setUserID]);

  return (
    <div className="flex flex-col w-full h-[90%] pt-7 gap-5">
      <div>
        <ButtonInputStep
          inputType={step === '2/4' ? 'password' : 'text'}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          invalidText={invalidText}
          invalidTextClass="truncate w-[70%]"
          step={step}
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={handleAdminNext} variant="success" width="30rem" height="80px">
          {t('next')}
        </Button>
      </div>
      <div className="flex self-center w-full justify-center pt-5">
        <ToggleInternet value={offLineMode} onClick={handleToggleInternet} />
      </div>
    </div>
  );
};

export default AdminBody;
