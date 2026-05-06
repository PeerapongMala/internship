// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import { Select } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import WCASchoolCard from '../local/components/web/atom/wc-a-school-card';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWStudentCard from '@component/web/cw-student-card';
import CWInputCheckbox from '@component/web/cw-input-checkbox';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const rowColumns: DataTableColumn[] = [
    {
      title: (
        <div className="flex gap-2">
          <CWInputCheckbox /> <span>#</span>
        </div>
      ),
      accessor: 'id',
      render: ({ id }: any, index) => {
        return (
          <div className="flex gap-2">
            <CWInputCheckbox /> <span>{id}</span>
          </div>
        );
      },
    },

    {
      title: 'ปีการศึกษา',
      accessor: 'year',
    },
    {
      title: 'ชั้นปี',
      accessor: 'level',
    },
    {
      title: 'ห้อง',
      accessor: 'room',
    },
    {
      title: 'แก้ไขล่าสุด',
      accessor: 'updated_at',
      render: (record: any, index: number) => (
        <>
          {new Date(record.updated_at).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </>
      ),
    },
    {
      title: 'แก้ไขล่าสุดโดย',
      accessor: 'updated_by',
    },
  ];

  const mockData = [
    {
      id: 1,
      year: '2564',
      level: 'ชั้นปีที่ 1',
      room: 'ห้อง 1',
      updated_at: '2022-01-01 12:00:00',
      updated_by: 'Admin',
    },
  ];

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

      <div className="datatables">
        {mockData.length > 0 ? (
          <DataTable
            className="table-hover whitespace-nowrap"
            records={mockData}
            columns={rowColumns}
            highlightOnHover
            withTableBorder
            withColumnBorders
            recordsPerPage={10}
            page={1}
            totalRecords={20}
            onPageChange={() => {}}
            recordsPerPageOptions={[10, 25, 50, 100]}
            onRecordsPerPageChange={() => {}}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
            styles={{
              root: { minHeight: '300px' },
            }}
          />
        ) : (
          <DataTable
            className="table-hover whitespace-nowrap"
            records={[]}
            columns={rowColumns}
            noRecordsText="ไม่พบข้อมูล"
            highlightOnHover
            withTableBorder
            withColumnBorders
            styles={{
              root: { minHeight: '300px' },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DomainJSX;
