import { HtmlHTMLAttributes, useState } from 'react';
import { TUnderlineMenu } from './types/underline-menu';

type UnderlineMenuProps = HtmlHTMLAttributes<HTMLDivElement> & {
  tabs: TUnderlineMenu[];
  initialActiveTab?: number;
};

const UnderlineMenu = ({ tabs, initialActiveTab }: UnderlineMenuProps) => {
  const [activeTab, setActiveTab] = useState<number>(initialActiveTab ?? 0);

  return (
    <div className="w-full">
      <div className="flex justify-center border-b border-gray-200 shadow-3xl">
        <div className="flex w-full justify-center">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(i);
                tab.onClick?.(i);
              }}
              className="relative w-full px-1 py-2 text-center"
            >
              <span
                className={`font-noto-sans-thai text-[14px] font-medium ${
                  activeTab === i ? 'text-primary' : 'text-dark hover:text-black'
                }`}
              >
                {tab.label}
              </span>
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-3xl" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnderlineMenu;
