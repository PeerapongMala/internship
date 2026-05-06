import CWInputSearch from '@component/web/cw-input-search';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWSchoolCard from '@component/web/cw-school-card';
import CWSelect from '@component/web/cw-select';
import CWStudentCard from '@component/web/cw-student-card';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '@domain/g03/g03-d04/local/api';
import StoreGlobal from '@global/store/global';
import showMessage from '@global/utils/showMessage.ts';
import { Link } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';

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

  const rowColumns: DataTableColumn[] = [
    {
      title: 'ดูข้อมูล',
      accessor: '',
      width: 100,
      textAlign: 'center',
      render: ({ id }: any) => {
        return (
          <div className="flex w-full justify-center">
            <Link to={`/teacher/student/student-info/1/history/group/${id}`}>
              <IconEye />
            </Link>
          </div>
        );
      },
    },
    {
      title: '#',
      accessor: 'id',
      width: 50,
    },
    {
      title: 'ชื่อกลุ่มเรียน',
      accessor: 'group_name',
    },
  ];

  const mockData = [
    {
      id: 1,
      group_name: 'กลุ่มเรียน 1',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
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
        <div className={'flex items-center gap-2'}>
          <CWMDaterange />
          <CWSelect title="ปีการศึกษา" className="min-w-36" options={[]} />
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
