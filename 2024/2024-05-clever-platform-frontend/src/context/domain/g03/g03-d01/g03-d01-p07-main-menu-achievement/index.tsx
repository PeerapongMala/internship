import StoreGlobal from '@store/global';
import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ButtonBack from '../../../../global/component/web/atom/wc-a-button-back';
import API from '../local/api';
import Dialog from './component/web/atom/wc-a-dialog';
import SafezonePanel from './component/web/atom/wc-a-Safezone-panel';
import Tabs from './component/web/template/wc-a-tabs';
import ConfigJson from './config/index.json';
import { Achievement } from './type';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [achievement, setAchievement] = useState<Achievement[]>([]);
  console.log({ achievement: achievement });
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

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

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    async function fetchHomeWork() {
      if (subject) {
        const res = await getAchievement(subject.subject_id);
        if (res.status_code === 200) {
          setAchievement(res.data);
        }
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
  const renderHeader = () => (
    <div className="flex gap-5 ">
      <ButtonBack className="!w-[70px] !h-[65px]" buttonClassName="!p-0" />
      <div className="w-full bg-white flex items-center relative rounded-[20px]  border-4 border-white bg-opacity-80">
        <h1 className="text-lg font-bold py-2 w-full pl-5">
          {subject && `ระดับชั้น ${subject.year_short_name} / ${subject.subject_name}`}
        </h1>
      </div>
    </div>
  );

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      className="flex-1 relative"
    >
      <SafezonePanel className="flex flex-col gap-5 inset-0 px-5 py-5">
        <div className="w-full ">{renderHeader()}</div>
        <div className="w-full h-full">
          <Dialog className="!gap-0">
            <div className="w-full bg-transparent flex justify-center ">
              <h1 className="text-[24px] font-bold py-2">{t('prize')}</h1>
            </div>
            <Tabs achievement={achievement} />
          </Dialog>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
