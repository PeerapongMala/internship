import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWSchoolCard from '@component/web/cw-school-card';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import SchoolInfo from './pages/school-info';
import StudentInfo from './pages/student-info';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import TemplateDocument from './pages/template-document';
import AdditionalInfo from './pages/additional-info';
import { useNavigate, useSearch } from '@tanstack/react-router';

const DomainJSX = () => {
  const { tab: urlTab }: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate({
    from: 'grade-system/setting',
  });

  const [selectedTab, setSelectedTab] = useState(urlTab || 'school');
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const SwitchTabs = [
    {
      id: 'school',
      label: ' ข้อมูลโรงเรียน',
      content: <SchoolInfo />,
      onClick: () => setSelectedTab('school')
    },
    {
      id: 'student',
      label: ' ข้อมูลนักเรียน',
      content: <StudentInfo />,
      onClick: () => setSelectedTab('student')
    },
    {
      id: 'additional',
      label: ' ข้อมูลเพิ่มเติม',
      content: <AdditionalInfo />,
      onClick: () => setSelectedTab('additional')
    },
    {
      id: 'template',
      label: ' Template เอกสาร',
      content: <TemplateDocument />,
      onClick: () => setSelectedTab('template')
    },
  ]

  useEffect(() => {
    navigate({
      search: {
        tab: selectedTab,
      },
    });
  }, [selectedTab]);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName
        links={[
          {
            href: '#',
            disabled: true,
            label: 'การเรียนการสอน',
          },
          {
            href: '/',
            label: 'ระบบตัดเกรด (ปพ.)',
            disabled: true,
          },
          {
            label: 'ตั้งค่า',
          },
        ]}
      />

      <CWSchoolCard
        code="0000001"
        name="โรงเรียนเกษม"
        subCode="xxx"
        image="/public/logo192.png"
        className="mb-5 mt-5"
      />

      <h2 className="my-5 text-xl font-bold">ตั้งค่าระบบ</h2>

      <CWSwitchTabs
        tabs={SwitchTabs}
        initialTabId={selectedTab}
      />
    </LayoutDefault>
  );
};

export default DomainJSX;
