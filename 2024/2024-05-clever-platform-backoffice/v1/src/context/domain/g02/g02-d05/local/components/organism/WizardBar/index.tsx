import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from '@tanstack/react-router';

interface Tab {
  id: number;
  label: string;
  icon: React.ReactNode;
  path?: string;
}

interface WizardBarProps {
  tabs: Tab[];
  activeId?: number;
}

const WizardBar = ({ tabs, activeId }: WizardBarProps) => {
  const location = useLocation();
  const { academicLevelId, subLessonId } = useParams({ from: '' });
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);

  const getWidth = (id: number) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    const width = (index / (tabs.length - 1)) * 96 + '%';

    return width;
  };

  const getTabUrl = (path?: string) => {
    return path?.replace('SUBLESSONID', subLessonId);
  };

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.path === location.pathname);
    if (index > -1) {
      setActiveTab(tabs[index].id);
    }
  }, [location]);

  useEffect(() => {
    if (activeId) {
      setActiveTab(activeId);
    }
  }, [activeId]);

  return (
    <div className="inline-block w-full">
      <div className="relative z-[1]">
        <div
          className={`absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-white-light transition-[width] ltr:left-0 rtl:right-0`}
          style={{ width: '95%' }}
        ></div>
        <div
          className={`absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-primary transition-[width] ltr:left-0 rtl:right-0`}
          style={{ width: getWidth(activeTab) }}
        ></div>
        <div className={`mb-2 flex justify-between`}>
          {tabs.map((tab) => (
            <div key={tab.id} className="flex flex-col items-center">
              <Link
                disabled={academicLevelId === undefined}
                to={getTabUrl(tab.path) + `/${academicLevelId}` || '#'}
                className={`${activeTab >= tab.id ? '!border-primary !bg-primary text-white' : ''} flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#f3f2ee] bg-white dark:border-[#1b2e4b] dark:bg-[#253b5c]`}
                onClick={() => {
                  if (academicLevelId) {
                    setActiveTab(tab.id);
                  }
                }}
              >
                {tab.icon}
              </Link>
              <span
                className={`${activeTab >= tab.id ? 'text-primary' : ''}text-center mt-2 block font-bold`}
              >
                {tab.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WizardBar;
