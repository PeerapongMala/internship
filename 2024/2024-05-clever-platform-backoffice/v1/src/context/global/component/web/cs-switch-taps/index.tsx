import React, { useState } from 'react';
import WhiteBox from '../cw-white-box';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

export interface CWSwitchTabTab {
  id: string;
  label: string;
  content?: React.ReactNode;
  onClick?: () => void;
}

interface SwitchTabsProps {
  className?: string;
  tabs: CWSwitchTabTab[];
  initialTabId?: string;
}

const CWSwitchTabs = ({ className, tabs, initialTabId }: SwitchTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialTabId ?? tabs[0].id);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* Tab Navigation */}
      <div className="flex w-full border-b-[1px] bg-white dark:bg-black">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              tab.onClick?.();
            }}
            className={`px-5 py-1 text-[14px] hover:border-b-2 hover:border-primary ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-400'
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tabs.find((tab) => tab.id === activeTab)?.content}
    </div>
  );
};

export default CWSwitchTabs;
