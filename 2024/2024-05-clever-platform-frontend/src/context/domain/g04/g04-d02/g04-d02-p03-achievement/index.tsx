import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import LevelTab from '@component/web/organism/wc-o-level-tab';
import { LevelDetails, LevelList } from '@domain/g04/g04-d01/local/type';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Buttonback from '../../../../global/component/web/atom/wc-a-button-back';
import API from './api';
import { WCBreadcrumb } from './component/web/atom/wc-a-breadcrumb';
import Dialog from './component/web/atom/wc-a-dialog';
import SafezonePanel from './component/web/atom/wc-a-Safezone-panel';
import Tabs from './component/web/template/wc-a-tabs';
import ConfigJson from './config/index.json';
import { Achievement } from './type';
// import { Button } from './component/web/atom/wc-a-button';
type CombinedLevelType = LevelList & Omit<LevelDetails, 'status'>;

const DomainJSX = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([ConfigJson.key]);
  const { sublessonId } = useParams({ strict: false });
  console.log({ sublessonId: sublessonId });
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  const [achievement, setAchievement] = useState<Achievement[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const breadcrumbItems = breadcrumbs.map((item) => ({ label: item }));

  // const [levelData, setLevelData] = useState<CombinedLevelType[]>([]);
  // console.log({ levelData: levelData });

  const getAchievement = async (subjectId: string) => {
    return await API.achievement
      .Gets(subjectId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  // useEffect(() => {
  //   if (sublessonStoreIsReady) {
  //     const levelStoreSublesson = StoreSublessons.MethodGet().getLevels(
  //       sublessonId,
  //     ) as LevelList[];
  //     const levelStoreLevel = StoreLevel.MethodGet().getLevels() as {
  //       [levelId: string]: LevelDetails | undefined;
  //     }[];

  //     const newLevelData = levelStoreSublesson.map((level) => {
  //       const levelDetails = levelStoreLevel[level.id] ?? ({} as LevelDetails);
  //       return { ...levelDetails, ...level };
  //     }) as CombinedLevelType[];

  //     setLevelData(newLevelData);
  //   }
  // }, [sublessonId, sublessonStoreIsReady]);

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, [])

  useEffect(() => {
    if (lessonStoreIsReady && sublessonStoreIsReady) {
      const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);

      StoreSublessons.MethodGet().sublessonSelect(loadedSublesson);

      const loadedLesson = StoreLessons.MethodGet().get(loadedSublesson?.lesson_id);
      console.log({ loadedLesson: loadedLesson });

      const newBreadcrumbs = [];

      if (currentSubject) {
        newBreadcrumbs.push(currentSubject.year_short_name);
        newBreadcrumbs.push(currentSubject.subject_name);
      }

      if (loadedLesson) {
        newBreadcrumbs.push(loadedLesson.name);
      }

      if (loadedSublesson) {
        newBreadcrumbs.push(loadedSublesson.name);
      }

      setBreadcrumbs(newBreadcrumbs);
    }
  }, [currentSubject, lessonStoreIsReady, sublessonStoreIsReady]);

  useEffect(() => {
    async function fetchHomeWork() {
      if (!currentSubject) return;
      const res = await getAchievement(currentSubject.subject_id);
      if (res.status_code === 200) {
        setAchievement(res.data);
      }
    }

    if (currentSubject) {
      fetchHomeWork();
      // set background image by subject group id
      if (currentSubject?.seed_subject_group_id) {
        StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
          currentSubject.seed_subject_group_id,
        );
      }
      const newBreadcrumbs = [
        `ระดับชั้น ${currentSubject.year_short_name}`,
        `วิชา${currentSubject.subject_name}`,
        // `บทที่ ${currentSubject.lesson_name}`,
      ];
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [currentSubject]);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="flex inset-0">
        {/* <div className="flex flex-col justify-center items-center gap-10 pl-20">
          <Buttonback />
          <LevelTab activeTabName="Achievement" />
        </div> */}
        <div className="flex gap-3 absolute w-full my-5 px-5 ">
          <Buttonback className=" w-[68px] h-[64px]" />
          <div className="w-full flex justify-start items-center rounded-[20px]  border-4 border-white bg-white bg-opacity-80 px-5 ">
            {/* <div className="flex items-center text-2xl">
              {breadcrumbs.map((item, i) => {
                return (
                  <div key={i}>
                    <span>{item}</span>
                    {i !== breadcrumbs.length - 1 && <span>&nbsp;&#62;&nbsp;</span>}
                  </div>
                );
              })}
            </div> */}
            <WCBreadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="pl-10 pt-40">
          <LevelTab activeTabName="Achievement" id={sublessonId} />
        </div>

        <Dialog className="!gap-0 mt-28">
          <div className="w-full bg-transparent flex justify-center ">
            <h1 className="text-[24px] font-bold py-2">{t('achievement.prize')}</h1>
          </div>
          <div className="w-full h-auto">
            <Tabs achievement={achievement} />
          </div>
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
