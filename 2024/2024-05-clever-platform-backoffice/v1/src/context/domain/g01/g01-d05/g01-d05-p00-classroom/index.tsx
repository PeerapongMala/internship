import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import './index.css';

import ConfigJson from './config/index.json';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import CWTLayout from '../local/component/web/template/cw-t-layout';
import ClassroomManage from './page/ClassroomManage';
import CWMTabs from '@component/web/molecule/cw-n-tabs';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { schoolId } = useParams({ strict: false });
  const location = useLocation();

  const [menuIndex] = useState(4);

  const schoolPath = `/admin/school/${schoolId}`;
  const menuTabs = [
    { key: `${schoolPath}?tab=school-info`, label: t('tab.schoolDetail') },
    {
      key: `${schoolPath}?tab=contract-management`,
      label: t('tab.manageDocument'),
    },
    {
      key: `${schoolPath}?tab=curriculum-management`,
      label: t('tab.manageCourse'),
    },
    { key: `${schoolPath}?tab=user-management`, label: t('tab.manageUser') },
    { key: location.pathname, label: t('tab.manageClassroom') },
    {
      key: `${schoolPath}?tab=teacher-management`,
      label: t('tab.manageTeacher'),
    },
  ];

  const school = {
    office: 'สำนักงานคณะกรรมการศึกษาพื้นฐาน',
    area: 'เขตตรวจราชการ 1',
    areaProvince: 'สพป. เชียงใหม่ เขต 1',
    schoolYear: 2567,
    name: 'โรงเรียนสาธิตมัธยม',
    code: '00000000001',
    subCode: 'AA109',
    image: '',
  };

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  // [NOTE] หน้านี้ไม่ได้ใช้งาน Page จริง ๆ จะอยู่ที่ ./page/ClassroomManage/index.tsx
  return (
    <CWTLayout
      breadcrumbs={[
        { text: t('breadcrumb.admin'), href: '#' },
        { text: t('breadcrumb.manageSchool'), href: '#' },
        { text: `${school.name}`, href: '#' },
      ]}
    >
      {/* <CWMSchoolCard {...school} /> */}
      <div className="gap-2.5 rounded-md bg-neutral-100 p-2.5 dark:bg-black">
        <ol className="flex text-left text-xl font-bold text-neutral-900 underline dark:text-neutral-500">
          <li>
            <span className="underline">สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน</span>
          </li>
          <li className="before:px-1.5 before:content-['/']">
            <span className="underline">เขตตรวจราชการ 1</span>
          </li>
          <li className="before:px-1.5 before:content-['/']">
            <span className="underline">สพป. เชียงใหม่ เขต 1</span>
          </li>
          <li className="before:px-1.5 before:content-['/']">
            <span className="underline">โรงเรียนสาธิตมัธยม</span>
          </li>
        </ol>
        <p className="text-sm font-normal">รหัสโรงเรียน: {schoolId} (ตัวย่อ: AA109)</p>
      </div>

      <CWMTabs
        items={menuTabs.map((t) => t.label)}
        currentIndex={menuIndex}
        onClick={(i) => {
          let href = menuTabs[i]?.key ?? '';
          if (href) navigate({ to: href });
        }}
      />

      <ClassroomManage />
    </CWTLayout>
  );
};

export default DomainJSX;
