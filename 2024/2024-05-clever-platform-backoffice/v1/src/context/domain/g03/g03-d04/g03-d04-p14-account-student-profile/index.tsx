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
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';

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

      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <div className="rounded bg-white p-5 shadow">
            <h2 className="text-xl font-bold">ข้อมูลทั่วไป</h2>

            <div className="flex py-4">
              <img
                className="mr-5 aspect-square h-40 w-40 rounded-full bg-gray-600"
                src="/public/logo192.png"
              />
              <div className="grow px-5">
                <div className="grid grid-cols-2 gap-5">
                  <CWInput disabled label="ชั้น" />
                  <CWInput disabled label="ห้อง" />
                  <CWInput disabled label="รหัสนักเรียน" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <CWInput disabled label="เลขประจำตัวประชาชน่นำรดj" />
                  <CWSelect options={[]} disabled label="คำนำหน้า" />
                  <CWInput disabled label="ชื่อ" />
                  <CWInput disabled label="นามสกุล" />
                  <CWInput disabled label="วันเกิด" />
                  <CWInput disabled label="เชื้อชาติ" />
                  <CWInput disabled label="สัญชาติ" />
                  <CWSelect options={[]} disabled label="ศาสนา" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded bg-white p-5 shadow">
            <h2 className="text-xl font-bold">ข้อมูล บิดา-มารดา</h2>

            <div className="my-3 flex">
              <CWSelect className="min-w-32" options={[]} disabled label="คำนำหน้าบิดา" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <CWInput disabled label="ชื่อ" />
              <CWInput disabled label="นามสกุล" />
            </div>

            <div className="my-3 flex">
              <CWSelect
                className="min-w-32"
                options={[]}
                disabled
                label="คำนำหน้ามารดา"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <CWInput disabled label="ชื่อ" />
              <CWInput disabled label="นามสกุล" />
            </div>

            <div className="my-3 flex">
              <CWSelect
                className="min-w-32"
                options={[]}
                disabled
                label="สถานภาพสมรสของบิดามารดา"
              />
            </div>

            <h2 className="my-3 text-xl font-bold">ข้อมูล ผู้ปกครอง</h2>
            <div className="my-3 flex gap-5">
              <CWSelect
                className="min-w-32"
                options={[]}
                disabled
                label="ความเกี่ยวข้องกับนักเรียน"
              />
              <CWSelect className="min-w-32" options={[]} disabled label="คำนำหน้า" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <CWInput disabled label="ชื่อ" />
              <CWInput disabled label="นามสกุล" />
            </div>
          </div>

          <div className="my-5 rounded bg-white p-5 shadow">
            <h2 className="text-xl font-bold">ที่อยู่</h2>
            <div className="grid grid-cols-4 gap-5">
              <CWInput disabled label="บ้านเลขที่" />
              <CWSelect options={[]} disabled label="หมู่" />
              <CWSelect options={[]} disabled label="ตำบล" />
              <CWSelect options={[]} disabled label="อำเภอ" />
              <CWSelect options={[]} disabled label="จังหวัด" />
              <CWInput disabled label="รหัสไปรษณีย์" />
            </div>
          </div>
        </div>

        <div className="grid h-fit grid-cols-3 bg-white p-5 shadow">
          <label>สถานะ</label>
          <span className="col-span-2">ใช้งาน</span>

          <label>แก้ไขล่าสุด</label>
          <span className="col-span-2">20 ก.พ 2565 24:24</span>

          <label>แก้ไขล่าสุดโดย</label>
          <span className="col-span-2">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
