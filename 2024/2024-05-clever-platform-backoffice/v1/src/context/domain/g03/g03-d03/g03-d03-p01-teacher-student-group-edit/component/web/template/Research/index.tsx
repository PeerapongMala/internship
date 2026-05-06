import { useState } from 'react';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CwTestPair from './wc-t-test-pair';
import CwDifficulty from './wc-t-difficulty';

const TeacherStudentGroupResearch = ({ studentGroup }: { studentGroup: string }) => {
  const [subTabResearch, setSubTabResearch] = useState<string>('t-test-pair-model');
  const tabsList = [
    {
      key: 't-test-pair-model',
      label: 'T-Test Pair Model',
    },
    {
      key: 'item-difficulty',
      label: 'ค่าความยากง่าย อำนาจจำแนก ค่าความเชื่อมั่น',
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="bg-white shadow-sm">
          <CWMTabs
            items={tabsList.map((t) => t.label)}
            currentIndex={tabsList.findIndex((tab) => tab.key === subTabResearch)}
            onClick={(index) => setSubTabResearch(tabsList[index].key)}
          />
        </div>
        <div className="bg-white p-3 shadow-sm">
          {subTabResearch === 't-test-pair-model' ? (
            <CwTestPair studentGroup={studentGroup} />
          ) : (
            <CwDifficulty />
          )}
        </div>
      </div>
    </>
  );
};

export default TeacherStudentGroupResearch;
