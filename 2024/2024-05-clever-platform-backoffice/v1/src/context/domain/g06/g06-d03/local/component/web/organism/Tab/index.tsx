import { TabGroup, TabList, Tab } from '@headlessui/react';
import { Link, useLocation } from '@tanstack/react-router';

export default () => {
  const location = useLocation();
  const tabs = [
    {
      name: 'รายวิชา',
      to: '/phorpor5/course',
    },
    {
      name: 'ปภ ปพ.5 รายชั้น',
      to: '/phorpor5/phorpor5-class',
    },
    {
      name: 'ปภ ปพ.5 รายวิชา',
      to: '/phorpor5/phorpor5-course',
    },
    {
      name: 'ชื่อนักเรียน',
      to: '/phorpor5/students',
    },
    {
      name: 'บิดา-มารดา',
      to: '/phorpor5/father-mother',
    },
    {
      name: 'ผู้ปกครอง',
      to: '/phorpor5/parents',
    },
    {
      name: 'เวลาเรียน',
      to: '/phorpor5/class-time',
    },
    {
      name: 'สรุปโภชนาการ*',
      to: '/phorpor5/nutritional-summary',
    },
    {
      name: 'ผลสัมฤทธิ์ทางการเรียน*',
      to: '/phorpor5/learning-outcomes',
    },
    {
      name: 'คุณลักษณะอันพึงประสงค์',
      to: '/phorpor5/desired-attributes',
    },
    {
      name: 'สมรรถนะ',
      to: '/phorpor5/competencies',
    },
    {
      name: 'กิจกรรมพัฒนาผู้เรียน',
      to: '/phorpor5/student-development-activities',
    },
    {
      name: 'เอกสารแนบท้าย',
      to: '/phorpor5/student-development-activities',
    },
  ];

  return (
    <div>
      {/* {location.pathname} */}

      <TabGroup as="div" className="mb-5 bg-white px-3">
        <TabList className="mb-5 mt-3 flex overflow-x-auto whitespace-nowrap border-white-light p-0 py-1.5">
          {tabs.map((tab, index) => (
            <Tab key={`phorpor5-tab-${index}`}>
              <Link
                to={tab.to}
                className={`border-b px-2 pb-1 text-xs ${location.pathname === tab.to ? 'border-b-blue-500 text-blue-500' : ''}`}
              >
                {tab.name}
              </Link>
            </Tab>
          ))}
        </TabList>
      </TabGroup>
    </div>
  );
};
