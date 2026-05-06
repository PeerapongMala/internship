import React, { useState } from 'react';
import { cn } from '../utils/cn';

interface TabProps {
  tabs: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

const Tab: React.FC<TabProps> = ({ tabs, onChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (onChange) {
      onChange(tabs[index].value);
    }
  };

  return (
    <div className="relative flex w-full">
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            'btn',
            index === activeTab
              ? 'btn-outline-primary'
              : 'btn-outline-dark !border-none opacity-50',
            '!rounded-none !border-x-0 !border-b-[2px] !border-t-0',
            'hover:!bg-inherit hover:!text-primary',
          )}
          onClick={() => handleTabChange(index)}
        >
          {tab.label}
        </button>
      ))}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-dark opacity-10" />
    </div>
  );
};

export default Tab;
