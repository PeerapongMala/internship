import React from 'react';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

export interface CWMTabsProps {
  items: string[];
  currentIndex: number;
  onClick: (index: number) => void;
}

const CWMTabs: React.FC<CWMTabsProps> = ({ items, currentIndex, onClick }) => {
  return (
    <div className="w-full border-b border-neutral-200 bg-white">
      <div className="flex w-full flex-wrap">
        {items.map((text, index) => (
          <button
            onClick={() => onClick(index)}
            key={text}
            className={cn(
              'min-w-[80px] px-4 py-2 text-center text-sm',
              index === currentIndex
                ? 'border-b-[1px] border-primary text-primary'
                : 'border-b-[1px] border-transparent text-neutral-500 hover:border-primary',
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CWMTabs;
