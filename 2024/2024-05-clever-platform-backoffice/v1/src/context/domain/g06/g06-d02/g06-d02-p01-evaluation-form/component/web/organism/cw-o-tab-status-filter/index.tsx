import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { EEvaluationFormStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import { useState } from 'react';

type TabStatusFilterProps = {
  onSelectFilter?: (filter?: EEvaluationFormStatus) => void;
};

const TabStatusFilter = ({ onSelectFilter }: TabStatusFilterProps) => {
  const tabsList = [
    { key: '', label: 'ทั้งหมด' },
    { key: EEvaluationFormStatus.IN_PROGRESS, label: 'กำลังกรอกข้อมูล' },
    { key: EEvaluationFormStatus.REPORT_AVAILABLE, label: 'รอออกรายงาน' },
    { key: EEvaluationFormStatus.REPORTED, label: 'ออกรายงานแล้ว' },
    { key: EEvaluationFormStatus.DRAFT, label: 'แบบร่าง' },
    { key: EEvaluationFormStatus.DISABLED, label: 'ไม่ใช้งาน' },
  ];
  const [selectedTab, setSelectedTab] = useState('');

  const handleSetFilter = (index: number) => {
    if (tabsList[index].key === '') {
      onSelectFilter?.(undefined);
      return;
    }

    onSelectFilter?.(tabsList[index].key as EEvaluationFormStatus);
  };

  return (
    <CWMTabs
      items={tabsList.map((t) => t.label)}
      currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
      onClick={(index) => {
        setSelectedTab(tabsList[index].key);
        handleSetFilter(index);
      }}
    />
  );
};

export default TabStatusFilter;
