// import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import SubjectTeacherHeader from './component/web/template/wc-t-header';

import Tabs from '../local/component/web/molecule/wc-m-tabs';
import { useState } from 'react';
import SubjectTeacherManagement from './pages/SubjectTeacherManagement';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const [menuTab, setMenuTab] = useState<string>('#teacher');

  const menuTabs = [
    { label: t('tab.schoolDetail'), value: '#school' },
    { label: t('tab.manageDocument'), value: '#document' },
    { label: t('tab.manageCourse'), value: '#course' },
    { label: t('tab.manageUser'), value: '#user' },
    { label: t('tab.manageClassroom'), value: 'classroom' },
    { label: t('tab.manageTeacher'), value: '#teacher' },
  ];

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        <SubjectTeacherHeader />
        <Tabs tabs={menuTabs} currentTab={menuTab} setCurrentTab={setMenuTab} />
      </div>

      <SubjectTeacherManagement />
    </LayoutDefault>
  );
};

export default DomainJSX;
