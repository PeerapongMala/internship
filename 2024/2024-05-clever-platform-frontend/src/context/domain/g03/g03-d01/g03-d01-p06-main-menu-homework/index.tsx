import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import Buttonback from '@global/component/web/atom/wc-a-button-back';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import Dialog from './component/web/atom/wc-a-dialog';
import SafezonePanel from './component/web/atom/wc-a-Safezone-panel';
// import Tabs from './component/web/template/wc-a-tabs';
import Tabs from '@domain/g04/g04-d02/g04-d02-p02-homework/component/web/template/wc-a-tabs';
import API from '@domain/g04/g04-d02/local/api';
import { Homework } from '@domain/g04/g04-d02/local/type';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']) as {
    currentSubject: SubjectListItem;
  };
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        subject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

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
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    async function fetchHomeWork() {
      const homeworks = await getHomework(subject.subject_id);
      if (homeworks.status_code === 200) {
        setHomeworks(homeworks.data);
      }
    }

    fetchHomeWork();

    const newBreadcrumbs = [
      `ระดับชั้น ${subject.year_short_name}`,
      `วิชา${subject.subject_name}`,
    ];
    setBreadcrumbs(newBreadcrumbs);
  }, [subject]);

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      className="flex-1 relative"
    >
      <SafezonePanel className="flex flex-col gap-5 inset-0 px-5 py-5">
        <div className="w-full ">{renderHeader(subject)}</div>
        <div className="w-full h-full">
          <Dialog className="!gap-0">
            <div className="w-full bg-transparent flex justify-center ">
              <h1 className="text-[24px] font-bold py-2"> {t('homework')}</h1>
            </div>
            <Tabs homeworks={homeworks} />
          </Dialog>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

const renderHeader = (subject: SubjectListItem) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate({ to: `/main-menu`, replace: true });
  };

  return (
    <div className="flex gap-5">
      <Buttonback className="w-[68px] h-[64px]" onClick={handleBackClick} />
      <div className="w-full bg-white flex items-center relative rounded-[20px]  border-4 border-white bg-opacity-80">
        <h1 className="text-lg font-bold py-2 w-full pl-5">
          ระดับชั้น {subject.year_short_name} / {subject.subject_name}
        </h1>
      </div>
    </div>
  );
};

export default DomainJSX;
