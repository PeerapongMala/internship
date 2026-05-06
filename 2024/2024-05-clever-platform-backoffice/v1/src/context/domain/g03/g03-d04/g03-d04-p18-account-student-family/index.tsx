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
        urlBack="/teacher/student/account-pin"
        studentName="เด็กหญิง ณัฐกรณ์ พูนเพิ่ม"
        studentCode="00000000001"
        schoolCode="00000000001"
        schoolSubCode="AA109"
      />

      <CWMTab
        tabs={[
          {
            name: 'ข้อมูลนักเรียน',
            to: '/teacher/student/all-student/1',
            checkActiveUrl: '/teacher/student/all-student/$studentId',
          },
          {
            name: 'ข้อมูลบัญชี & พิน',
            to: '/teacher/student/all-student/1/account-pin',
            checkActiveUrl: '/teacher/student/all-student/$studentId/account-pin',
          },
          {
            name: 'ประวัติการเล่น',
            to: '/teacher/student/all-student/1/history',
            checkActiveUrl: '/teacher/student/all-student/$studentId/history',
          },
          {
            name: 'ประวัติชั้นเรียน',
            to: '/teacher/student/all-student/1/class-history',
            checkActiveUrl: '/teacher/student/all-student/$studentId/class-history',
          },
          {
            name: 'ครอบครัว',
            to: '/teacher/student/all-student/1/family',
            checkActiveUrl: '/teacher/student/all-student/$studentId/family',
          },
        ]}
      />

      <div className="min-h-64 rounded bg-white p-5 shadow">
        <h2 className="mb-5 text-xl font-bold">ข้อมูลครอบครัว</h2>
        <div className="grid w-fit grid-cols-2 gap-x-5">
          <label>รหัสครอบครัว: </label>
          <span>00000000001</span>

          <label>เจ้าของ: </label>
          <span>นาย ทดสอบ ทดสอบ</span>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
