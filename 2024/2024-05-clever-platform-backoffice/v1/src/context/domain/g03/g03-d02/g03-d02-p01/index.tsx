import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { CWMBreadcrumbItems } from '@component/web/molecule/cw-m-breadcrumb';
import GradingLayout from '../local/components/web/template/GradingLayout';
import { CWMSchoolCardProps } from '@component/web/molecule/cw-m-school-card';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import WCAIconCalendar from '@component/web/atom/wc-a-icons/IconCalendar';
import WCAIconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import WCAIconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import WCAIconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import CWOPhorPro6Table, {
  HeaderType,
  PhorPro6TableProps,
} from './components/web/organism/cw-o-table';

const DomainJSX = () => {
  const [tabIndex, setTabIndex] = useState(3);
  const tabItems = [
    'ปพ.6',
    'เล่มปพ.6',
    'ใบรับรอง',
    'คะแนนรายชั้น',
    'เกรดรายชั้น',
    'เกรดร้อยละ',
  ];

  const breadcrumbItems: CWMBreadcrumbItems[] = [
    {
      text: 'โรงเรียนสาธิตมัธยม',
      href: '#',
    },
    {
      text: 'ระบบตัดเกรด (ปพ.)',
      href: '#',
    },
    {
      text: 'ระบบตัดเกรด (ปพ.)',
    },
  ];

  const school: CWMSchoolCardProps = {
    name: 'โรงเรียนสาธิตมัธยม',
    code: '00000000001',
    subCode: 'AA109',
    image: 'https://www.mwit.ac.th/html/wp-content/uploads/2019/11/brand-mwit.png',
  };

  const years = [
    { value: '2567', label: 'ปีการศึกษา 2567' },
    { value: '2566', label: 'ปีการศึกษา 2566' },
    { value: '2565', label: 'ปีการศึกษา 2565' },
  ];

  const levels = [
    { value: '1', label: 'ประถมศึกษาปีที่ 1' },
    { value: '2', label: 'ประถมศึกษาปีที่ 2' },
    { value: '3', label: 'ประถมศึกษาปีที่ 3' },
  ];

  const rooms = [
    { value: '1', label: ' ห้อง 1' },
    { value: '2', label: ' ห้อง 2' },
    { value: '3', label: ' ห้อง 3' },
  ];

  const now = new Date();
  const nextDate = new Date();
  nextDate.setDate(now.getDate() + 1);
  const range = [now, nextDate];

  const table: PhorPro6TableProps = {
    headers: [
      { type: HeaderType.SINGLE, key: 'no', label: 'เลขที่' },
      { type: HeaderType.SINGLE, key: 'name', label: 'ชื่อสกุล' },
      {
        key: 'scores',
        label: 'คะแนนผลการเรียน',
        type: HeaderType.GROUP,
        groups: [
          {
            key: 'sub1',
            label: 'ภาษาไทย',
            value: '##',
          },
          {
            key: 'sub2',
            label: 'คณิตศาสตร์',
            value: '##',
          },
          {
            key: 'sub3',
            label: 'วิทยาศาสตร์และเทคโนโลยี',
            value: '##',
          },
          {
            key: 'sub4',
            label: 'สังคมศึกษา ศาสนาและวัฒนธรรม',
            value: '##',
          },
          {
            key: 'sub5',
            label: 'ประวัติศาสตร์',
            value: '##',
          },
          {
            key: 'sub6',
            label: 'สุขศึกษาและพลศึกษา',
            value: '##',
          },
          {
            key: 'sub7',
            label: 'ศิลปะ',
            value: '##',
          },
          {
            key: 'sub8',
            label: 'การงานอาชีพ',
            value: '##',
          },
          {
            key: 'sub9',
            label: 'ภาษาอังกฤษเพื่อการสื่อสาร(เพิ่มเติม)',
            value: '##',
          },
          {
            key: 'subSum',
            label: 'รวม',
            value: '100',
          },
        ],
      },
      { type: HeaderType.SINGLE, key: 'percentage', label: 'ร้อยละ' },
      { type: HeaderType.SINGLE, key: 'rank', label: 'ลำดับที่คะแนนรวม' },
    ],
    data: [
      ...Array.from({ length: 24 }, (_, i) => ({
        no: (i + 1).toString(),
        name: 'Kristin Watson',
        sub1: '0',
        sub2: '0',
        sub3: '0',
        sub4: '0',
        sub5: '0',
        sub6: '0',
        sub7: '0',
        sub8: '0',
        sub9: '0',
        subSum: {
          value: '100',
          className: 'text-primary',
        },
        percentage: {
          value: (Math.random() * (20 - 1) + 1).toFixed(1),
          className: 'text-primary',
        },
        rank: {
          value: (Math.floor(Math.random() * 10) + 1).toString(),
          className: 'text-primary',
        },
      })),
    ],
  };

  return (
    <GradingLayout
      title="ระบบตัดเกรด (ปพ.6)"
      breadcrumbItems={breadcrumbItems}
      schoolCard={school}
      tabs={{
        items: tabItems,
        currentIndex: tabIndex,
        onClick: () => {},
      }}
    >
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-5">
            <button className="btn btn-primary gap-x-1">
              <WCAIconUpload />
              CSV
            </button>
            <button className="btn btn-primary gap-x-1">
              <WCAIconDownload />
              CSV
            </button>
          </div>
          <div className="group relative w-52">
            <input
              type="text"
              placeholder="ค้นหา"
              className="peer form-input ltr:pr-8 rtl:pl-8"
            />
            <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
              <WCAIconSearch />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="group relative">
            <Flatpickr
              value={range}
              className="h-[38px] w-full overflow-hidden rounded-md border border-neutral-200 p-3"
              options={{ mode: 'range', dateFormat: 'd/m/Y' }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
              <WCAIconCalendar />
            </div>
          </div>
          <Select defaultValue={years[0]} options={years} />
          <Select defaultValue={levels[0]} options={levels} />
          <Select defaultValue={rooms[0]} options={rooms} />
        </div>
        <CWOPhorPro6Table {...table} />
      </div>
    </GradingLayout>
  );
};

export default DomainJSX;
