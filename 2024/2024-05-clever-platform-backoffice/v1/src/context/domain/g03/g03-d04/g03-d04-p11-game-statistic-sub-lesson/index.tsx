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
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CwProgress from '@component/web/cw-progress';
import CWSelect from '@component/web/cw-select';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWInputSearch from '@component/web/cw-input-search';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWStudentCard from '@component/web/cw-student-card';
import { formatTimeString } from '@global/utils/format/time';

interface DataProp {
  id: number;
  index: string;
  type: string;
  format: string;
  level: string;
  averageScore: number;
  averageTimes: number;
  times: number;
  averageTime: number;
  lastTime: string;
}

const DomainJSX = () => {
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

  const rowColumns: DataTableColumn<DataProp>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: '',
      render: (record: any, index: number) => (
        <div className="text-center">
          <Link
            to={`/teacher/student/all-student/$studentId/history/game-statistic-overview/1/1/ง่าย`}
          >
            <IconEye />
          </Link>
        </div>
      ),
    },
    {
      title: '#',
      accessor: 'id',
    },
    {
      title: 'ด่านที่',
      accessor: 'index',
    },
    {
      title: 'ประเภท',
      accessor: 'type',
    },
    {
      title: 'รูปแบบคำถาม',
      accessor: 'format',
    },
    {
      title: 'ระดับ',
      accessor: 'level',
      render: (record: any, index: number) => (
        <>
          {record.level === 'ง่าย' && (
            <span className="rounded border border-success px-2 text-success">ง่าย</span>
          )}
          {record.level === 'ปานกลาง' && (
            <span className="rounded border border-warning px-2 text-warning">
              ปานกลาง
            </span>
          )}
          {record.level === 'ยาก' && (
            <span className="rounded border border-danger px-2 text-danger">ยาก</span>
          )}
        </>
      ),
    },
    {
      title: 'คะแนนรวมเฉลี่ย (คะแนน)',
      accessor: 'averageScore',
      render: (record: any, index: number) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">{record.averageScore}/100</span>
            <div className="ml-auto w-16">
              <CwProgress percent={52} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบโดยเเฉลี่ย (ครั้ง)',
      accessor: 'averageTimes',
    },
    {
      title: 'ทำข้อสอบแล้ว (ครั้ง)',
      accessor: 'times',
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'averageTime',
      render: ({ averageTime }) => formatTimeString(averageTime),
    },
    {
      title: 'ทำข้อสอบล่าสุด',
      accessor: 'lastTime',
    },
  ];

  const mockData = [
    {
      id: 1,
      index: '1',
      type: 'แบบฝึกหัด',
      format: 'ปรนัยแบบเลือกตอบ',
      level: 'ง่าย',
      averageScore: 100,
      averageTimes: 0.0,
      times: 0,
      averageTime: 0.0,
      lastTime: '20 ก.พ 2565 24:24',
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
              '/teacher/student/all-student/$studentId/history/game-statistic-overview/$mainLessonId/$subLessonId',
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
      <div className="mb-5 flex items-center gap-5">
        <Link to="/teacher/student/all-student/1/history/game-statistic-overview/1">
          <IconArrowBackward />
        </Link>
        <span className="text-xl font-bold">
          มภร. สวนสุนันทา / คณิตศาสตร์ / บทที่ 1 จำนวนนับ / บทที่ 1-1 จำนวนนับไม่เกิน 1
          ล้าน
        </span>
      </div>
      <div className="w-full rounded bg-white p-5 shadow">
        <div className="mb-5 flex justify-between">
          <div className="flex">
            <div className="dropdown mt-1.5">
              <Dropdown
                placement={'bottom-start'}
                btnClassName="btn btn-primary dropdown-toggle gap-1"
                button={
                  <>
                    Bulk Edit
                    <IconCaretDown />
                  </>
                }
              ></Dropdown>
            </div>

            <span className="ml-4 mr-2 h-full !w-px bg-neutral-300" />

            <div className="w-fit">
              <CWInputSearch placeholder="ค้นหา" />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary flex gap-1"
            onClick={() => setOpen('download')}
          >
            <IconDownload />
            Download
          </button>
        </div>

        <div className="mb-5 flex gap-2">
          <CWSelect
            className="min-w-56"
            title="ข้อมูลย้อนหลัง (2560-2566)"
            options={[]}
          />
          <div className="mt-1.5">
            <CWMDaterange />
          </div>
          <CWSelect className="min-w-56" title="ประเภท ทั้งหมด" options={[]} />
          <CWSelect className="min-w-56" title="ระดับ ทั้งหมด" options={[]} />
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
