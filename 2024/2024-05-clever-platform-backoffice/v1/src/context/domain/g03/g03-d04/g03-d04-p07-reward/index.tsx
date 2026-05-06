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
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWInputSearch from '@component/web/cw-input-search';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();

  const [open, setOpen] = useState('');

  const onClose = () => {
    setOpen('');
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownload = () => {
    console.log('Downloading data from:', startDate, 'to:', endDate);
  };
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const rowColumns: DataTableColumn[] = [
    {
      title: '#',
      accessor: 'id',
    },
    {
      title: 'รหัสไอเทม',
      accessor: 'item_id',
    },
    {
      title: 'ประเภท',
      accessor: 'type',
    },
    {
      title: 'รูปภาพ',
      accessor: 'image',
      render: (record: any, index: number) => {
        return <img src={record.image} alt="" className="h-8 w-8 object-cover" />;
      },
    },
    {
      title: 'ชื่อรางวัล',
      accessor: 'name',
    },
    {
      title: 'คำอธิบาย',
      accessor: 'description',
    },
    {
      title: 'จำนวน',
      accessor: 'quantity',
    },
    {
      title: 'ได้รับจาก',
      accessor: 'received_from',
    },
    {
      title: 'ได้รับเมื่อ',
      accessor: 'received_at',
      render: (record: any, index: number) => (
        <>
          {new Date(record.received_at).toLocaleDateString('th-TH', {
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
      title: 'ใช้งานเมื่อ',
      accessor: 'used_at',
      render: (record: any, index: number) => (
        <>
          {new Date(record.used_at).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </>
      ),
    },
  ];

  const mockData = [
    {
      id: 1,
      item_id: '0000000001',
      type: 'รางวัล',
      image: '/public/logo192.png',
      name: 'รางวัลคะแนน',
      description: 'รางวัลคะแนน',
      quantity: 1,
      received_from: 'ครู',
      received_at: '2022-01-01 12:00:00',
      used_at: '2022-01-01 12:00:00',
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
      <div className="w-full rounded bg-white p-5 shadow">
        <div className="mb-5 flex justify-between">
          <CWInputSearch placeholder="ค้นหา" />

          <button
            type="button"
            className="btn btn-primary flex gap-1"
            onClick={() => setOpen('download')}
          >
            <IconDownload />
            Download
          </button>
        </div>
        <div className={'mb-5 flex items-center gap-2'}>
          <div className="mt-1.5">
            <CWMDaterange />
          </div>
          <CWSelect title="สังกัดวิชา" className="min-w-36" options={[]} />
          <CWSelect title="วิชา" className="min-w-36" options={[]} />
        </div>

        <div className="datatables">
          <DataTable
            columns={rowColumns}
            data={[] as any}
            styles={{
              root: { minHeight: '300px' },
            }}
            records={mockData}
            recordsPerPage={10}
            page={1}
            totalRecords={20}
            highlightOnHover
            withTableBorder
            withColumnBorders
            onPageChange={() => {}}
            recordsPerPageOptions={[10, 25, 50, 100]}
            onRecordsPerPageChange={(_recordsPerPage) => {}}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
          />
        </div>
      </div>
      <CWModalDownload
        open={open === 'download'}
        onClose={onClose}
        onDownload={handleDownload}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      ;
    </div>
  );
};

export default DomainJSX;
