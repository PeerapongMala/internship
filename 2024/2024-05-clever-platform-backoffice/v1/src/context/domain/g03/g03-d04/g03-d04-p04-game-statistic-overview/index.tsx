import CWInputSearch from '@component/web/cw-input-search';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CwProgress from '@component/web/cw-progress';
import CWSelect from '@component/web/cw-select';
import CWStudentCard from '@component/web/cw-student-card';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import StoreGlobal from '@global/store/global';
import { Link } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWSchoolCard from '@component/web/cw-school-card';
import API from '@domain/g03/g03-d04/local/api';
import showMessage from '@global/utils/showMessage.ts';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import { formatTimeString } from '@global/utils/format/time';

interface DataProp {
  id: number;
  student_id: string;
  year: string;
  class: string;
  room: string;
  affiliation: string;
  subject: string;
  main_lesson: string;
  pass_section: number;
  pass_score: string;
  attempt: string;
  average_time: number;
  last_used: string;
  last_updated: string;
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [open, setOpen] = useState('');

  const onClose = () => {
    setOpen('');
  };

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [schoolData, setSchoolData] = useState<SchoolResponse>();

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const res = await API.school.GetSchoolId();
        if (res.status_code === 200) {
          setSchoolData(res.data);
        }
      } catch (error) {
        showMessage(`Failed to fetch schools: ${error}`, 'error');
      }
    };

    fetchSchoolData();
  }, []);

  const rowColumns: DataTableColumn<DataProp>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: 'id',
      render: ({ id }) => {
        return (
          <Link to={`/teacher/student/student-info/1/history/game-statistic-overview/1`}>
            <IconEye />
          </Link>
        );
      },
    },
    {
      title: (
        <div className="flex gap-2">
          <span>#</span>
        </div>
      ),
      accessor: '',
      render: ({ id }: DataProp, index) => {
        return (
          <div className="flex gap-2">
            <span>{id}</span>
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
      accessor: 'class',
    },
    {
      title: 'ห้อง',
      accessor: 'room',
    },
    {
      title: 'สังกัดวิชา',
      accessor: 'affiliation',
    },
    {
      title: 'วิชา',
      accessor: 'subject',
    },
    {
      title: 'บทเรียนหลัก',
      accessor: 'main_lesson',
    },

    {
      title: 'ด่านที่ผ่าน (ด่าน)',
      accessor: 'pass_section',
      render: ({ pass_section }) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">{pass_section}/100</span>
            <div className="ml-auto w-16">
              <CwProgress percent={52} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ด่านที่ผ่าน (คะแนน)',
      accessor: 'pass_score',
      render: ({ pass_score }) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">52/100</span>
            <div className="ml-auto w-16">
              <CwProgress percent={52} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบ (ครั้ง)',
      accessor: 'attempt',
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'average_time',
      render: ({ average_time }) => formatTimeString(average_time),
    },
    {
      title: 'เข้าสู่ระบบล่าสุด',
      accessor: 'last_used',
    },
  ];

  const dataMockPage1 = [
    {
      id: 1,
      student_id: '00000000001',
      year: '2566',
      class: 'มัธยมศึกษาปี 1',
      room: 'ห้อง 1',
      subject: 'คณิตศาสตร์',
      affiliation: 'มรภ. สวนสุนันทา',
      main_lesson: 'บทที่ 1 จำนวนนับ',
      pass_section: 30,
      pass_score: 'คะแนน',
      attempt: '00.0',
      average_time: 0.0,
      last_used: '20 ก.พ 2565 24:24',
      last_updated: '20 ก.พ 2565 24:24',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CWMBreadcrumb
        items={[
          {
            text: 'การเรียนการสอน',
            href: '/',
          },
          {
            text: 'ข้อมูลนักเรียน',
          },
        ]}
      />

      <CWSchoolCard
        name={schoolData?.school_name || '-'}
        code={schoolData?.school_id.toString() || '-'}
        subCode={schoolData?.school_code || '-'}
        image={schoolData?.image_url || '/public/logo192.png'}
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
            to: '/teacher/student/student-info/1/history/game-statistic-overview',
            checkActiveUrl:
              '/teacher/student/student-info/$studentId/history/game-statistic-overview',
          },
          {
            name: 'กลุ่มเรียน',
            to: '/teacher/student/student-info/1/history/group',
            checkActiveUrl: '/teacher/student/student-info/$studentId/history/group',
          },
          {
            name: 'แบบทดสอบ',
            to: '/teacher/student/student-info/1/history/level-overview',
            checkActiveUrl:
              '/teacher/student/student-info/$studentId/history/level-overview',
          },
          {
            name: 'รางวัล',
            to: '/teacher/student/student-info/1/history/reward',
            checkActiveUrl: '/teacher/student/student-info/$studentId/history/reward',
          },
          {
            name: 'โน๊ตจากครู',
            to: '/teacher/student/student-info/1/history/teacher-comments',
            checkActiveUrl:
              '/teacher/student/student-info/$studentId/history/teacher-comments',
          },
        ]}
      />

      <div className="panel flex flex-col gap-5">
        <div className="flex justify-between">
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

        <div className="flex gap-6">
          <CWSelect title="สังกัดวิชา" className="min-w-52" options={[]} />
          <CWSelect title="วิชา" className="min-w-52" options={[]} />
          <CWSelect title="บทเรียน" className="min-w-52" options={[]} />
        </div>

        <div className="datatables">
          <DataTable
            columns={rowColumns}
            data={[] as any}
            styles={{
              root: { minHeight: '300px' },
            }}
            records={dataMockPage1}
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
        onDownload={() => {}}
        startDate={''}
        endDate={''}
        setStartDate={() => {}}
        setEndDate={() => {}}
      />
    </div>
  );
};

export default DomainJSX;
