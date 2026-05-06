import React, { useState } from 'react';
import WhiteBox from '../Whitebox';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SwitchTabsProps {
  tabs: Tab[];
}

const SwitchTabs = ({ tabs }: SwitchTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8 mt-10 flex w-full border-b-[1px] bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-1 text-[14px] ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <WhiteBox className="p-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </WhiteBox>
    </div>
  );
};

export default SwitchTabs;
