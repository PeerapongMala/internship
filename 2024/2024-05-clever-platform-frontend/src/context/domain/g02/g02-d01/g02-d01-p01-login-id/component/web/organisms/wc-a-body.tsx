import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@global/component/web/atom/wc-a-button';
import ButtonInputStep from '@global/component/web/atom/wc-a-button-input-step';
import ToggleInternet from '@global/component/web/molecule/wc-m-toggle-internet';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const Body = ({
  schoolID,
  setSchoolID,
  userID,
  setUserID,
  handleNext,
  inputFailed,
  offLineMode,
  handleToggleInternet,
}: {
  schoolID: string;
  setSchoolID: (value: string) => void;
  userID: string;
  setUserID: (value: string) => void;
  handleNext: () => void;
  inputFailed: boolean;
  offLineMode: boolean;
  handleToggleInternet: any;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { t } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  return (
    <div className="flex flex-col w-full h-[90%] pt-7 gap-5">
      <div className="">
        <ButtonInputStep
          value={stateFlow === STATEFLOW.SchoolID ? schoolID : userID}
          onChange={stateFlow === STATEFLOW.SchoolID ? setSchoolID : setUserID}
          placeholder={
            stateFlow === STATEFLOW.SchoolID
              ? t('placeholder_school')
              : t('placeholder_user')
          }
          invalidText={
            inputFailed
              ? stateFlow === STATEFLOW.SchoolID
                ? t('school_code_incorrect_please_try_again')
                : t('user_code_incorrect_please_try_again')
              : ''
          }
          step={stateFlow === STATEFLOW.SchoolID ? '1/2' : '2/2'}
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          // suffix={<img src={ImageArrowRight} className="h-10 w-16 mt-2 pr-2" />}
          variant="success"
          width="30rem"
          height="80px"
        >
          {t('next')}
        </Button>
      </div>
      <div className="flex self-center w-full justify-center pt-5">
        <ToggleInternet value={offLineMode} onClick={handleToggleInternet} />
      </div>
    </div>
  );
};

export default Body;
