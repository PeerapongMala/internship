import { TabGroup, TabList, Tab } from '@headlessui/react';
import { Link, useParams } from '@tanstack/react-router';

export default ({ page }: { page: string }) => {
  const { path, evaluationFormId } = useParams({
    strict: false,
  });

  const tabs = [
    {
      name: 'เกรดร้อยละ',
      to: `/grade-system/evaluation/report/${evaluationFormId}/phorpor5/${path}?page=1`,
    },
    {
      name: 'เกรดรายชั้น',
      to: `/grade-system/evaluation/report/${evaluationFormId}/phorpor5/${path}?page=2`,
    },
    {
      name: 'คะแนนรวมรายชั้น',
      to: `/grade-system/evaluation/report/${evaluationFormId}/phorpor5/${path}?page=3`,
    },
  ];

  return (
    <div>
      {/* {location.pathname} */}

      <TabGroup as="div" className="mb-5">
        <TabList className="mb-5 flex overflow-x-auto whitespace-nowrap border-white-light p-0 py-1.5">
          {tabs.map((tab, index) => (
            <Tab key={`phorpor5-tab-${index}`}>
              <Link
                to={tab.to}
                className={`border-b px-2 py-1 pb-1 text-xs ${page === tab.to.split('?')[1].split('=')[1] ? 'border-blue-500 text-blue-500' : ''}`}
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
