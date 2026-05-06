import { useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import LevelTab from '@component/web/organism/wc-o-level-tab';
import { SublessonEntity } from '@domain/g04/g04-d01/local/type';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate } from '@tanstack/react-router';
import Buttonback from '../../../../global/component/web/atom/wc-a-button-back';
import API from '../local/api';
import { Homework } from '../local/type';
import Dialog from './component/web/atom/wc-a-dialog';
import SafezonePanel from './component/web/atom/wc-a-Safezone-panel';
import Tabs from './component/web/template/wc-a-tabs';

const DomainJSX = () => {
  const navigate = useNavigate();

  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);
  const { currentSublesson } = StoreSublessons.StateGet(['currentSublesson']) as {
    currentSublesson: SublessonEntity;
  };
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  const handleBackClick = () => {
    const loadedSublesson = StoreSublessons.MethodGet().get(currentSublesson?.id);
    const lessonId = loadedSublesson?.lesson_id;
    navigate({ to: `/sublesson/${lessonId}`, replace: true });
  };

  const getHomework = async (subjectId: string) => {
    return await API.Level.GetHomeworkBySubjectId(subjectId)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  useEffect(() => {
    async function fetchHomeWork() {
      if (!subject) return;
      const homeworks = await getHomework(subject.subject_id);
      if (homeworks.status_code === 200) {
        setHomeworks(homeworks.data);
      }
    }

    if (subject) {
      fetchHomeWork();

      // set background image by subject group id
      if (subject?.seed_subject_group_id) {
        StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
          subject.seed_subject_group_id,
        );
      }

      const newBreadcrumbs = [
        `ระดับชั้น ${subject.year_short_name}`,
        `วิชา${subject.subject_name}`,
      ];
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [subject]);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="flex inset-0">
        {/* <div className="flex flex-col justify-center items-center gap-10 pl-20">
          <Buttonback />
          <LevelTab activeTabName="Homework" />
        </div> */}
        <div className="flex gap-3 absolute w-full my-5 px-5 ">
          <Buttonback className=" w-[68px] h-[64px]" onClick={handleBackClick} />
          <div className="w-full flex justify-start items-center rounded-[20px]  border-4 border-white bg-white bg-opacity-80 px-5 ">
            <h1 className="text-lg py-2">{breadcrumbs.join(' > ')}</h1>
          </div>
        </div>

        <div className="pl-10 pt-40">
          <LevelTab activeTabName="Homework" />
        </div>

        <Dialog className="!gap-0 mt-28">
          <div className="w-full bg-transparent flex justify-center ">
            <h1 className="text-[24px] font-bold py-2">การบ้าน</h1>
          </div>
          <div>
            <Tabs homeworks={homeworks} />
          </div>
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
