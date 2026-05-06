import { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { withClassName } from '@global/utils/react-node-with-classname';

interface Tab {
  id: number;
  label: string;
  icon: React.ReactNode;
  path?: string;
}

interface WizardBarProps {
  disabled?: boolean;
  tabs: Tab[];
  /**
   * will override all activeTab state when include
   */
  customActiveTab?: number;
  /**
   * will override all setActiveTab setState function when include
   */
  customSetActiveTab?: (tab: number) => void;
}

/**
 * Choose between tabs and (customActiveTab, customSetActiveTab)
 */
const CWWizardBar = ({
  tabs,
  customActiveTab,
  customSetActiveTab,
  disabled,
}: WizardBarProps) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

  const currentTab = customActiveTab ?? activeTab;
  const updateTab = customSetActiveTab ?? setActiveTab;

  const getWidth = (id: number) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    return `${(index / (tabs.length - 1)) * 96}%`;
  };

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.path === location.pathname);
    if (index > -1) {
      updateTab(tabs[index].id);
    }
  }, [location]);

  return (
    <div className="inline-block w-full">
      <div className="relative z-[1]">
        {/* Background line */}
        <div
          className="absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-white-light transition-[width] ltr:left-0 rtl:right-0"
          style={{ width: '95%' }}
        />
        {/* Progress line */}
        <div
          className="absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-primary transition-[width] ltr:left-0 rtl:right-0"
          style={{ width: getWidth(currentTab) }}
        />

        <div className="mb-2 flex justify-between">
          {tabs.map((tab) => {
            const isActive = currentTab >= tab.id;
            const isExact = currentTab === tab.id;

            const iconColor = isActive ? 'text-white' : 'text-neutral-400';
            const iconNode = withClassName(tab.icon, iconColor);

            const baseClass =
              'flex h-16 w-16 items-center justify-center rounded-full bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]';
            const activeBgClass = isActive ? '!bg-primary text-white' : '';

            const defaultBorderClass = isExact ? 'border-4 border-secondary' : '';
            const customBorderClass =
              customActiveTab !== undefined
                ? customActiveTab < tab.id
                  ? 'border-[3px] border-white-light'
                  : isExact
                    ? 'border-4 border-primary'
                    : 'border-4 border-primary'
                : '';

            return (
              <div key={tab.id} className="flex flex-col items-center">
                {tab.path && !customSetActiveTab && (
                  <Link
                    to={tab.path}
                    className={`${baseClass} ${activeBgClass} ${defaultBorderClass}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {iconNode}
                  </Link>
                )}

                {customSetActiveTab && customActiveTab !== undefined && (
                  <button
                    disabled={disabled}
                    className={`${baseClass} ${activeBgClass} ${customBorderClass}`}
                    onClick={() => customSetActiveTab(tab.id)}
                  >
                    {iconNode}
                  </button>
                )}

                <span
                  className={`mt-2 block text-center font-bold ${
                    isActive ? 'text-black' : ''
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CWWizardBar;
