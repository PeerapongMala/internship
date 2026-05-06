/* eslint-disable simple-import-sort/imports */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import { UserData } from '@domain/g02/g02-d01/local/type';
import Button from '@global/component/web/atom/wc-a-button';
import { IconCorrect, IconInCorrect } from '@global/component/web/atom/wc-a-icon-correct-incorrect';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import StoreLoadingScene from '@store/web/loading-scene';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import { SubjectListItem } from '../local/type';
import ImageBGLogin from './assets/background.png';
import LockedIcon from './assets/icon-locked.svg';
import SubjectIcon from './assets/subject-icon.png';
import ConfigJson from './config/index.json';
import styles from './index.module.css';


const FLAG_ITEMS: [keyof SubjectListItem, string][] = [
  ['is_school_subject_enabled', 'cond-1'],
  ['is_contract_enabled', 'cond-2'],
  ['is_in_contract_time', 'cond-3'],
  ['is_contract_subject_group_enabled', 'cond-4'],
  ['is_curriculum_group_enabled', 'cond-5'],
  ['is_platform_enabled', 'cond-6'],
  ['is_year_enabled', 'cond-7'],
  ['is_subject_group_enabled', 'cond-8'],
  ['is_subject_enabled', 'cond-9'],
  ['is_enabled', 'cond-10'],
];

// @million-ignore
const SubjectSlot = ({
  subject,
  onClick,
  setIsOpen,
  setListArray
}: {
  subject: SubjectListItem;
  onClick: (subject: SubjectListItem) => void;
  setIsOpen: (isOpen: boolean) => void;
  setListArray: (listArray: { text: string; correct: boolean }[]) => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    subject?.image_url ?? undefined,
  );

  const isAllEnabled = [
    subject.is_school_subject_enabled,
    subject.is_contract_enabled,
    subject.is_in_contract_time,
    subject.is_contract_subject_group_enabled,
    subject.is_curriculum_group_enabled,
    subject.is_platform_enabled,
    subject.is_year_enabled,
    subject.is_subject_group_enabled,
    subject.is_subject_enabled,
    subject.is_enabled,
  ].every(Boolean);

  return (
    <div
      className="!w-[256px] !h-full p-2 bg-white hover:translate-y-[-5%] text-center transition-all rounded-3xl"
      style={{
        background: '#FFFFFFCC',
        border: '4px solid linear-gradient(0deg, #FFFFFF, #FFFFFF)',
        boxShadow: '0px 16px 8px 0px #00000026, 0px 8px 0px 0px #DFDEDE',
      }}
      onClick={(evt) => {
        evt.preventDefault();

        if (isAllEnabled) {
          onClick(subject);
        } else {
          const outputArray = FLAG_ITEMS.map(([key, text]) => ({
            text,
            correct: Boolean(subject[key]),
          }));

          setListArray(outputArray);
          console.log('outputArray', outputArray);
          setIsOpen(true);
        }
      }}
    >
      <div className="relative h-full bg-white/80 rounded-3xl pb-4 gap-4 overflow-hidden">
        <div className="flex flex-col h-full">
          <img
            src={imageUrl ?? ''}
            alt="subject-icon"
            className="px-4 w-full min-h-[128px] h-auto mx-auto mt-4 select-none"
            style={{ opacity: isAllEnabled ? 1 : 0.25 }}
            onError={(evt) => {
              evt.currentTarget.onerror = null;
              setImageUrl(SubjectIcon);
            }}
          />
          <div className="flex-1 flex flex-col justify-end items-center mb-4">
            <p className="mb-4 font-bold text-2xl leading-6">{subject.subject_name}</p>
            <p className="tracking-tight">{subject.curriculum_group_name}</p>
          </div>
        </div>
        {!isAllEnabled && (
          <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-2xl bg-[#FCD401] flex">
            <img
              src={LockedIcon}
              alt="locked-icon"
              className="w-8 h-8 mx-auto my-auto select-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [listArray, setListArray] = useState<{ text: string; correct: boolean }[]>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  useEffect(() => {
    const isDebug = localStorage.getItem('debugMode') === 'true';
    setDebugMode(isDebug);
  }, []);
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSetListArray = (listArray: { text: string; correct: boolean }[]) => {
    setListArray(listArray);
  };

  const { subjects = [] } = StoreSubjects.StateGet(['subjects']) as {
    subjects: SubjectListItem[] | null | undefined;
  };


  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const { loadingIs, progress } = StoreLoadingScene.StateGet(['loadingIs', 'progress']);

  useEffect(() => {
    if (isOnline) {
      API.Subject.SubjectSelection.Get().then((res) => {
        if (res.status_code === 200) {

          StoreSubjects.MethodGet().listSubjectSet(res.data);

          console.log(' Subject Flags Debug:');
          res.data.forEach((subject: SubjectListItem) => {
            console.log(`--- ( ชื่อวิชา ${subject.subject_name}  ไอดี ${subject.subject_id} ) ---`);
            FLAG_ITEMS.forEach(([key, label]) => {
              const value = subject[key];
              console.log(
                value ? '✅' : '❌',
                `  ${t(label)} (${key})`,
              );
            });
          });
        }
      });
    }
  }, [isOnline, t]);

  const subjectsSlots = subjects
    ?.filter((subject) => {

      // if ture แสดงทุกตัว
      if (debugMode) {
        return true;
      }
      return [
        subject.is_school_subject_enabled,
        subject.is_contract_enabled,
        subject.is_in_contract_time,
        subject.is_contract_subject_group_enabled,
        subject.is_curriculum_group_enabled,
        subject.is_platform_enabled,
        subject.is_year_enabled,
        subject.is_subject_group_enabled,
        subject.is_subject_enabled,
        subject.is_enabled,
      ].every(Boolean);
    })
    .map((subject) => {
      return {
        key: subject.subject_id,
        subject: subject,
        onClick: (subject: SubjectListItem) => {
          handleSubjectClick(subject);
        },
      };
    });

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingIs],
  );

  const handleSubjectClick = (subject: SubjectListItem) => {
    // Handle the subject click event
    StoreSubjects.MethodGet().subjectSelect(subject);

    // after select subject, start loading scene
    navigate({ to: '/version-update', replace: true, viewTransition: true });
    StoreLoadingScene.MethodGet().start({
      delay: 0,
      cbAfterComplete: () => {
        // to-do: loading content logic
        // set global flag that we finish initialized content
        StoreGlobal.MethodGet().initializedSet(true);
      },
    });
  };

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);
  }, []); // Make sure to provide an appropriate dependency array

  useEffect(() => {
    // if enter loading state, which move to loading scene
    if (loadingIs) {
      // update progress
      const updateProgressInterval = setInterval(() => {
        if (progress < 100) {
          StoreLoadingScene.MethodGet().progressUpdate(Math.min(100, progress + 1));
        }
      }, 20);

      // after progress reach 100, clear its interval
      if (progress >= 100) {
        clearInterval(updateProgressInterval);
        // on loading complete
        StoreLoadingScene.MethodGet().complete({
          delay: 1000,
        });
      }
      return () => {
        clearInterval(updateProgressInterval);
      };
    }
  }, [loadingIs, progress]);

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      {/* Background Image */}
      <div
        // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>

      {isOpen && (
        <div>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-[55%] h-[70%] bg-white rounded-[60px] p-2">
              <div className="flex flex-col justify-between h-full bg-[#DADADA] rounded-[55px]">
                {/* Header */}
                <div className="relative w-full py-4 border-b-2 border-dashed border-secondary flex justify-center">
                  <div className="text-3xl font-bold">{t('subject-not-unlocked')}</div>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-auto px-10 py-6 text-2xl font-light leading-relaxed">
                  {t('please-check-conditions')}
                  {listArray.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      {Boolean(item.correct) ? <IconCorrect /> : <IconInCorrect />}
                      <span>{`${index + 1}. ${t(item.text)}`}</span>
                    </div>
                  ))}
                </div>

                {/* Confirm Button */}
                <div className="w-full flex justify-center pb-6">
                  <Button
                    className="w-[80%] justify-center items-center flex"
                    textClassName="text-xl justify-center items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('ok')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div className="opacity-70 absolute inset-0 z-40 w-[100000%] h-[100000%] top-[-1000%] left-[-1000%] bg-black" />
        </div>
      )}


      {/* Safezone */}
      <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0 flex flex-col overflow-hidden">
        {/* Title Content */}
        <div
          // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
          className="inset-0 gap-2 flex flex-col text-center pt-12 pb-6"
        >
          <div
            className={styles['noto-sans-thai']}
            style={{
              color: '#333',
              fontSize: '26px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: 'normal',
            }}
          >
            {t('title-school-name', { schoolName: userData.school_name })}
          </div>
          <div
            className={styles['noto-sans-thai1200']}
            style={{
              color: '#333',
              fontSize: '52px',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: 'normal',
            }}
          >
            {t('title-select-subject')}
          </div>
        </div>



        <ScrollableContainer
          className="overflow-x-auto h-full py-10 mt-6 mb-12 relative grid grid-flow-col auto-cols-max gap-4 px-10 focus:outline-none"
          style={{
            justifyContent: (subjectsSlots?.length ?? 0) > 4 ? 'flex-start' : 'center',
          }}
        >
          {subjectsSlots?.map((slot, index) => <SubjectSlot {...slot} setIsOpen={handleOpen} setListArray={handleSetListArray} key={index} />)}
        </ScrollableContainer>
      </SafezonePanel>
      <LoadingSceneUI />
    </ResponsiveScaler>
  );
};
export default DomainJSX;
