// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import WCASchoolCard from '../local/components/web/atom/wc-a-school-card';
import CWStudentCard from '@component/web/cw-student-card';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWInput from '@component/web/cw-input';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();

  const [showModalChangePin, setShowModalChangePin] = useState(false);

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

      <div className="bg-white p-5 shadow">
        <h2 className="text-xl font-bold">พินนักเรียน</h2>
        <button
          onClick={() => setShowModalChangePin(true)}
          className="btn btn-primary mt-5"
        >
          เปลี่ยนพิน
        </button>

        <hr className="my-5" />

        <h2 className="text-xl font-bold">ข้อมูลบัญชี</h2>

        <div className="my-5 grid grid-cols-1 gap-5">
          <div className="flex items-center gap-5">
            <img src="/public/logo192.png" className="h-6 w-6" alt="" />
            <div className="flex flex-col">
              <span className="font-bold">Google</span>
              <span>test@gmail.com</span>
            </div>
          </div>
          <hr />

          <div className="flex items-center gap-5">
            <img src="/public/logo192.png" className="h-6 w-6" alt="" />
            <div className="flex flex-col">
              <span className="font-bold">Google</span>
              <span>test@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <CWModalCustom
        onClose={() => setShowModalChangePin(false)}
        open={showModalChangePin}
        onOk={() => setShowModalChangePin(false)}
        buttonName="เปลี่ยนพิน"
        cancelButtonName="กลับ"
        title="เปลี่ยนพิน"
      >
        <div className="flex flex-col">
          <CWInput required label="รหัสนักเรียน" placeholder="0000000000" />
          <CWInput required label="กรอกพินใหม่" placeholder="00000" />
        </div>
      </CWModalCustom>
    </div>
  );
};

export default DomainJSX;
