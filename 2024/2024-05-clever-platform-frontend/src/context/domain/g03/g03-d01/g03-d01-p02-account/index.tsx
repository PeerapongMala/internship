import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ButtonBack from '@component/web/atom/wc-a-button-back';
import { UserData } from '@domain/g02/g02-d01/local/type';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import ImageAvatarDefault from './assets/avatar-default.png';
import ImageFacebookLogo from './assets/fb-logo.svg';
import ImageInstagramLogo from './assets/instagram-logo.svg';
import ImageLineLogo from './assets/line-logo.svg';
import ImageLineOAQRCode from './assets/line-oa-qrcode.png';
import { Button } from './component/web/atom/wc-a-button';
import { Dialog } from './component/web/atom/wc-a-dialog';
import { SafezonePanel } from './component/web/atom/wc-a-safezone-panel';
import { TextHeader, TextMuted } from './component/web/atom/wc-a-text';
import ConfigJson from './config/index.json';

enum STATEFLOW {
  Default,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };
  const userFullName = `${userData?.first_name} ${userData?.last_name}`;

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Default);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []); // Make sure to provide an appropriate dependency array

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {/* Safezone */}
      <SafezonePanel className="flex items-center inset-0">
        <Dialog>
          <div className="flex w-full h-full">
            <div className="flex flex-1 flex-col border-r-2 border-solid border-secondary h-full">
              <div className="h-20 justify-start items-center self-stretch border-b-2 border-dashed border-secondary relative">
                <ButtonBack className="absolute w-12 h-12 left-4 top-4" />
              </div>
              <div className="flex justify-between p-6 gap-4 bg-white bg-opacity-80 w-full">
                <div className="flex gap-2">
                  <img
                    src={userData?.image_url ?? ImageAvatarDefault}
                    className="w-[48px] h-[48px] rounded-full border-1 border-white border-solid"
                  />
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-gray-20">
                      {userFullName}
                    </span>
                    <span className="text-xl">
                      {t('display_role', {
                        /** todo: role teacher? */
                        role: 'Student',
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    console.log('copy button clicked');
                  }}
                >
                  {t('copy')}
                </Button>
              </div>
              <div className="grow flex p-4 gap-4 w-full">
                <div className="flex flex-col gap-4">
                  <TextMuted>{t('account_info_title')}</TextMuted>
                  <span className="text-2xl">
                    {t('account_info_uuid', { uuid: userData.id })}
                  </span>
                  <span className="text-2xl">
                    {t('account_info_student_id', { studentId: userData.student_id })}
                  </span>
                  <span className="text-2xl">
                    {t('account_info_school', {
                      schoolId: userData.school_id,
                      schoolName: userData.school_name,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col p-4 gap-2 w-full items-center justify-center border-t-2 border-dashed border-secondary">
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => {
                      console.log('edit account button clicked');
                    }}
                  >
                    {t('edit_account')}
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('edit password button clicked');
                    }}
                  >
                    {t('edit_password')}
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    console.log('upload history button clicked');
                  }}
                >
                  {t('upload_history')}
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col h-full">
              <div className="flex h-20 justify-center items-center self-stretch border-b-2 border-dashed border-secondary">
                <TextHeader>{t('contact_us')}</TextHeader>
              </div>
              <div className="grow flex flex-col items-center justify-center gap-y-4">
                <div className="flex gap-x-4 justify-center items-center">
                  <img src={ImageLineLogo} className="icon w-8 h-8" />
                  <span className="text-lg">LINE OA Clever</span>
                </div>
                <img src={ImageLineOAQRCode} className="w-36 h-36" />
                <div className="flex gap-x-4 justify-center items-center">
                  <img src={ImageFacebookLogo} className="icon w-8 h-8" />
                  <span className="text-lg">@Clever</span>
                </div>
                <div className="flex gap-x-4 justify-center items-center">
                  <img src={ImageInstagramLogo} className="icon w-8 h-8" />
                  <span className="text-lg">@Clever</span>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
