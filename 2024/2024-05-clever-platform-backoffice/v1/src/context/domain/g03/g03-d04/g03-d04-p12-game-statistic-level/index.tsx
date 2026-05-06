// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import WCASchoolCard from '../local/components/web/atom/wc-a-school-card';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWInputSearch from '@component/web/cw-input-search';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWStudentCard from '@component/web/cw-student-card';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { formatTimeString } from '@global/utils/format/time';

interface DataProp {
  id: number;
  attempt: number;
  score: number;
  time: number;
}

const DomainJSX = () => {
  const [showModal, setShowModal] = useState(false);
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
      title: 'ดูคำตอบ',
      accessor: '',
      render: (record: any, index: number) => (
        <button onClick={() => setShowModal(true)}>
          <IconEye />
        </button>
      ),
    },
    {
      title: '#',
      accessor: 'id',
    },
    {
      title: 'ทำครั้งที่',
      accessor: 'attempt',
    },
    {
      title: 'คะแนน',
      accessor: 'score',
    },
    {
      title: 'เวลา/ข้อ',
      accessor: 'time',
      render: ({ time }) => formatTimeString(time),
    },
    {
      title: 'เวลาทำข้อสอบ',
      accessor: 'time',
    },
  ];

  const mockData = [
    {
      id: 1,
      attempt: 1,
      score: 1,
      time: 1,
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
              '/teacher/student/all-student/$studentId/history/game-statistic-overview/$mainLessonId/$subLessonId/$levelId',
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
        <Link to="/teacher/student/all-student/1/history/game-statistic-overview/1/1">
          <IconArrowBackward />
        </Link>
        <span className="text-xl font-bold">
          มภร. สวนสุนันทา / คณิตศาสตร์ / บทที่ 1 จำนวนนับ / บทที่ 1-1 จำนวนนับไม่เกิน 1
          ล้าน / ง่าย
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
      <CWModalQuestionView
        open={showModal}
        onClose={() => setShowModal(false)}
        // CWModalQuestionView_please_fix_this_for_real_data
        levelId={2}
        levelPlayLogId={1}
      />
      {/* <CWModalCustom title='คำถาม' open={showModal} onClose={() => { setShowModal(false) }} onOk={() => { setShowModal(false) }} buttonName='ย้อนกลับ' outline>
        <div className='flex flex-col gap-4'>
          <b>วัตถุประสงค์การเรียนรู้</b>
          <span>xxxxxxx</span>
          <b>มาตรฐาน</b>
          <span>xxxxxxx</span>
          <b>ตัวชี้วัด</b>
          <span>xxxxxxx</span>

          <br />

          <div className="border">
            <button
              type="button"
              className={`px-4 py-1  h-fit w-full flex items-center  bg-[#F5F5F5]  `}
              onClick={() => {
                setPama(pama === '1' ? '' : '1')

              }}
            >
              <div className='mr-3' >
                {
                  pama !== '1' ? <IconArrowDown /> : <IconArrowUp />
                }
              </div>

              <div className='flex flex-grow justify-between'>
                <span className='font-bold'>ข้อที่1</span>
                <span>8 วินาที</span>
                <span>ถูก</span>
              </div>

            </button>
            <div>
              <AnimateHeight duration={300} height={pama === '1' ? 'auto' : 0}>
                <div className="space-y-2 p-4">
                  <p className='font-bold'>จงเลือกคำตอบที่ถูกต้อง</p>
                  <p className='font-bold'>คำตอบที่ถูกต้อง</p>
                  <p >ก</p>
                  <p className='font-bold'>คำตอบของนักเรียน</p>
                  <p >ข</p>
                </div>
              </AnimateHeight>
            </div>
          </div>
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
