// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import WCASchoolCard from '../local/components/web/atom/wc-a-school-card';
import CwProgress from '@component/web/cw-progress';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWStudentCard from '@component/web/cw-student-card';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWSelect from '@component/web/cw-select';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWInputSearch from '@component/web/cw-input-search';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import { formatTimeString } from '@global/utils/format/time';

interface DataProp {
  id: number;
  level: string;
  mini_lesson: string;
  pass_avg_section: number;
  score_avg: string;
  attempt: string;
  average_time: number;
  last_used: string;
  last_updated: string;
}

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

  const rowColumns: DataTableColumn<DataProp>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: '',
      render: ({ id }) => {
        return (
          <div className="flex justify-center">
            <Link to="/teacher/student/all-student/1/history/game-statistic-overview/1/1">
              <IconEye />
            </Link>
          </div>
        );
      },
    },
    {
      title: '#',
      accessor: 'id',
    },
    {
      title: 'บทเรียนย่อย',
      accessor: 'mini_lesson',
    },
    {
      title: 'ด่านที่',
      accessor: 'level',
    },
    {
      title: 'ด่านที่ผ่านเฉลี่ย (ด่าน)',
      accessor: 'pass_avg_section',
      render: ({ pass_avg_section }) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">{pass_avg_section}/100</span>
            <div className="ml-auto w-16">
              <CwProgress percent={52} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'คะแนนรวมเฉลี่ย (คะแนน)',
      accessor: 'pass_avg_section',
      render: ({ pass_avg_section }) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">{pass_avg_section}/100</span>
            <div className="ml-auto w-16">
              <CwProgress percent={52} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบโดยเฉลี่ย (ครั้ง)',
      accessor: 'attempt',
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'average_time',
      render: ({ average_time }) => formatTimeString(average_time),
    },
    {
      title: 'ทำข้อสอบล่าสุด',
      accessor: 'last_used',
    },
  ];

  const mockData = [
    {
      id: 1,
      level: '1',
      mini_lesson: 'บทที่ 1-1 จำนวนนับไม่เกิน 1 ล้าน',
      pass_avg_section: 100,
      score_avg: '100',
      attempt: '10',
      average_time: 10.0,
      last_used: '20 ก.พ. 2565 24:24',
      last_updated: '20 ก.พ. 2565 24:24',
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
              '/teacher/student/all-student/$studentId/history/game-statistic-overview/$mainLessonId',
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
        <Link to="/teacher/student/all-student/1/history/game-statistic-overview">
          <IconArrowBackward />
        </Link>
        <span className="text-xl font-bold">
          มภร. สวนสุนันทา / คณิตศาสตร์ / บทที่ 1 จำนวนนับ
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

        <div className="mb-5 flex gap-3">
          <div className="mt-1.5">
            <CWMDaterange />
          </div>
          <CWSelect title="บทเรียนย่อย ทั้งหมด" className="min-w-52" options={[]} />
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
