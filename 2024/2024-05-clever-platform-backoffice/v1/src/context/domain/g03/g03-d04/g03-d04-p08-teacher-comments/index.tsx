// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import { Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import WCASchoolCard from '../local/components/web/atom/wc-a-school-card';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWStudentCard from '@component/web/cw-student-card';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWInputSearch from '@component/web/cw-input-search';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div>
      <CWMBreadcrumb
        items={[
          {
            text: 'โรงเรียนสาธิตมัธยม',
            href: '#',
          },
          {
            text: 'การเรียนการสอน',
            href: '#',
          },
          {
            text: 'ข้อมูลนักเรียน',
          },
        ]}
      />

      <WCASchoolCard
        schoolName="โรงเรียนสาธิตมัธยม"
        schoolAbbreviation="AA109"
        schoolId="00000000001"
      />

      <CWStudentCard
        studentName="เด็กหญิง ณัฐกรณ์ พูนเพิ่ม"
        studentCode="00000000001"
        schoolCode="00000000001"
        schoolSubCode="AA109"
      />

      <CWMTab
        tabs={[
          {
            name: 'สรุปคะแนน',
            to: '/teacher/student/all-student/1/history/game-statistic-overview',
            checkActiveUrl:
              '/teacher/student/all-student/$studentId/history/game-statistic-overview',
          },
          {
            name: 'กลุ่มเรียน',
            to: '/teacher/student/all-student/1/history/group',
            checkActiveUrl: '/teacher/student/all-student/$studentId/history/group',
          },
          {
            name: 'แบบทดสอบ',
            to: '/teacher/student/all-student/1/history/level-overview',
            checkActiveUrl:
              '/teacher/student/all-student/$studentId/history/level-overview',
          },
          {
            name: 'รางวัล',
            to: '/teacher/student/all-student/1/history/reward',
            checkActiveUrl: '/teacher/student/all-student/$studentId/history/reward',
          },
          {
            name: 'โน๊ตจากครู',
            to: '/teacher/student/all-student/1/history/teacher-comments',
            checkActiveUrl:
              '/teacher/student/all-student/$studentId/history/teacher-comments',
          },
        ]}
      />

      <div className="w-full">
        <div className={'my-5 flex items-center gap-5'}>
          <Link
            to="/teacher/student/all-student/$studentId/history/teacher-comments/add-note"
            className="btn btn-primary"
          >
            {' '}
            <IconPlus /> เพิ่มโน๊ต
          </Link>
          <CWInputSearch placeholder="ค้นหา" />
        </div>
        <div className={'mb-5 flex items-center gap-2'}>
          <div className="mt-1.5">
            <CWMDaterange />
          </div>
          <CWSelect title="สังกัดวิชา" className="min-w-36" options={[]} />
          <CWSelect title="วิชา" className="min-w-36" options={[]} />
          <CWSelect title="บทเรียน" className="min-w-36" options={[]} />
          <CWSelect title="บทเรียนย่อย" className="min-w-36" options={[]} />
        </div>
      </div>

      {/* card comment */}
      <div className="w-full rounded bg-white p-5 shadow">
        <div className="flex gap-2">
          <img
            alt="school_image"
            src="/public/logo192.png"
            className="aspect-square h-8 w-8 rounded-full bg-blue-400"
          />
          <div>
            <h4 className="mb-2 font-bold">Teacher A</h4>
            <p>ปีการศีกษา 2567, ป.4 วว/ดด/ปปปป 00:00</p>
          </div>
        </div>
        <p className="my-3">
          Lorem ipsum dolor sit amet consectetur. Quis volutpat viverra etiam ullamcorper
          at. Non pretium pretium libero pellentesque ultricies. Pulvinar nec diam semper
          diam sit tincidunt laoreet sed leo. Leo iaculis ultrices ut interdum. Leo fames
          at.
        </p>

        {/* tag */}

        <div className="flex gap-3">
          <span className="mr-2 rounded-full border border-primary bg-blue-50/20 px-2.5 py-1 text-xs font-medium text-primary">
            #tag
          </span>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
