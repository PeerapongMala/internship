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
import CWStudentCard from '@component/web/cw-student-card';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWInputSearch from '@component/web/cw-input-search';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWModalPopup from '@component/web/cw-modal/cw-modal-popup';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [levelId, setLevelId] = useState(0);

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
      title: 'ดูคำถาม',
      accessor: '',
      render: (record: any, index: number) => (
        <button
          type="button"
          onClick={() => {
            setShowModal(true);
            setLevelId(record.id);
          }}
        >
          <IconEye />
        </button>
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
  ];

  const mockData = [
    {
      id: 1,
      index: 1,
      type: 'แบบฝึกหัด',
      format: 'ปรนัยแบบเลือกตอบ',
      level: 'ง่าย',
    },
    {
      id: 2,
      index: 2,
      type: 'แบบฝึกหัด',
      format: 'ปรนัยแบบเลือกตอบ',
      level: 'ปานกลาง',
    },
    {
      id: 3,
      index: 3,
      type: 'แบบฝึกหัด',
      format: 'ปรนัยแบบเลือกตอบ',
      level: 'ยาก',
    },
    {
      id: 4,
      index: 4,
      type: 'แบบฝึกหัด',
      format: 'ปรนัยแบบเลือกตอบ',
      level: 'ง่าย',
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
          <CWSelect title="บทเรียน" className="min-w-36" options={[]} />
          <CWSelect title="บทเรียนย่อย" className="min-w-36" options={[]} />
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
      <CWModalQuestionView
        open={showModal}
        onClose={() => setShowModal(false)}
        // CWModalQuestionView_please_fix_this_for_real_data
        levelId={levelId}
        // levelPlayLogId={1}
      />
      {/* 
      <CWModalCustom buttonName='ย้อนกลับ' open={showModal} onClose={() => setShowModal(false)} title='คำถาม'>
        <div>
          <h4 className='font-bold'>วัตถุประสงค์การเรียนรู้</h4>
          <p>xxxxx</p>
        </div>
        <div>
          <h4 className='font-bold'>มาตรฐาน</h4>
          <p>xxxxx</p>
        </div>
        <div>
          <h4 className='font-bold'>ตัวชี้วัด</h4>
          <p>xxxxx</p>
        </div>

        <hr />

        <div>
          <h4 className='font-bold'>ข้อที่ 1</h4>

        </div>

        <div>
          <h4 className='font-bold'>รูปแบบคำถาม</h4>
          <p>คำถามปรนัยแบบเลือกตอบ </p>
        </div>
        <div>
          <h4 className='font-bold'>โจทย์</h4>
          <p>จงเลือกคำตอบที่ถูกต้อง </p>
        </div>
        <div>
          <h4 className='font-bold'>ตัวเลือก</h4>
          <p>ก</p>
          <p>ข</p>
          <p>ค</p>
        </div>
        <div>
          <h4 className='font-bold'>คำตอบ</h4>
          <p>ก</p>
        </div>
        <div>
          <h4 className='font-bold'>Hint</h4>
          <p>- </p>
        </div>
      </CWModalCustom> */}
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
