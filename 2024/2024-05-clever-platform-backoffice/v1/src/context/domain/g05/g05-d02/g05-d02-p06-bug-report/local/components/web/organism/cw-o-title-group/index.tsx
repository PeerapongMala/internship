import CWTitleGroup from '@component/web/cw-title-group';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TBugReport } from '@domain/g05/g05-d02/local/types/bug-report';
import { API } from '@domain/g05/local/api';
import { ReactNode, useEffect, useState } from 'react';

type TitleGroupProps = {
  bug_id: string;
  className?: string;
};

const TitleGroup = ({ bug_id, className }: TitleGroupProps) => {
  const [bugReport, setBugReport] = useState<TBugReport>();

  useEffect(() => {
    fetchBugReport();
  }, []);

  const fetchBugReport = async () => {
    const response = await API.BugReport.GetBugReport({ bug_id: bug_id });

    setBugReport(response.data.data);
  };

  const titleText: ReactNode = `แจ้งโดย`;

  const subTitleText: { totalNumber?: number; title: string }[] = [
    {
      title: `รหัสบัญชี: ${bugReport?.created_by}`,
    },
    {
      title: `ชื่อ-สกุล: ${bugReport?.creater_first_name} ${bugReport?.creater_last_name} `,
    },
    {
      title: `ตำแหน่ง: ${bugReport?.role} `,
    },
  ];

  return (
    <div className={cn('w-full text-left', className)}>
      <div className="flex flex-col gap-2 rounded-md bg-neutral-100 p-4 text-neutral-900 md:gap-3 md:p-5">
        {/* Title Section */}
        <div className="flex items-center text-base font-bold md:text-lg lg:text-xl">
          {[titleText].map((text, index) => (
            <p key={`listText-${index}`} className="whitespace-nowrap">
              {text}
            </p>
          ))}
        </div>

        {/* Subtitle Section */}
        {subTitleText && subTitleText.length > 0 && (
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 md:grid-cols-1 md:gap-4">
            {subTitleText.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="flex items-center gap-1 text-sm"
              >
                {item.totalNumber && <span>{item.totalNumber}</span>}
                <span className="text-neutral-700">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleGroup;
