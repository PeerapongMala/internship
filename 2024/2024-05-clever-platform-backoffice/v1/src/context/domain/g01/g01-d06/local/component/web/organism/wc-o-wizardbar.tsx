import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

interface Tab {
  id: number;
  label: string;
  icon: React.ReactNode;
  path?: string;
}

interface WizardBarProps {
  tabs: Tab[];
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}

const WizardBar = ({ tabs, step, setStep }: WizardBarProps) => {
  const location = useLocation();

  const calculateLineWidth = (step: number) => {
    const index = Math.min(tabs.length - 1, tabs.findIndex((tab) => tab.id === step) + 1);
    const width = (index / (tabs.length - 1)) * 96 + '%';
    return width;
  };

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.path === location.pathname);
    if (index > -1) setStep(tabs[index].id);
  }, [location]);

  return (
    <div className="inline-block w-full">
      <div className="relative z-[1]">
        <div
          className={`absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-white-light transition-[width] ltr:left-0 rtl:right-0`}
          style={{ width: '95%' }}
        />

        {/** line */}
        <div
          className={`absolute top-[30px] -z-[1] m-auto ml-4 h-1 bg-primary transition-[width] ltr:left-0 rtl:right-0`}
          style={{ width: calculateLineWidth(step) }}
        />

        <div className={`mb-2 flex justify-between`}>
          {tabs.map((tab) => (
            <div key={tab.id} className="flex flex-col items-center">
              <Link
                to={tab.path || '#'}
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full text-neutral-400',
                  'border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b]',
                  'bg-white dark:bg-[#253b5c]',
                  step >= tab.id && '!border-primary !bg-primary !text-white',
                )}
                onClick={() => setStep(tab.id)}
              >
                {tab.icon}
              </Link>
              <span
                className={cn(
                  'mt-2 block text-center text-neutral-400',
                  step >= tab.id && 'font-bold text-black',
                  step === tab.id && '!text-primary',
                )}
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
