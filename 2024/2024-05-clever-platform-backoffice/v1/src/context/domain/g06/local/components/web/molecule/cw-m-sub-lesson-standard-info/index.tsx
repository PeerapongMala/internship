import { useEffect, useMemo, useState, ReactNode, Fragment } from 'react';
import API from '@domain/g02/g02-d05/local/api';
import { AcademicLevel } from '@domain/g02/g02-d05/local/type';

type SubLessonStandardInfoProps = {
  subLessonID?: number;
};

const SubLessonStandardInfo = ({ subLessonID }: SubLessonStandardInfoProps) => {
  const [standard, setStandard] = useState<AcademicLevel>();

  useEffect(() => {
    if (!subLessonID) return;

    API.academicLevel.GetG02D05A41(String(subLessonID)).then((res) => {
      if (res.status_code === 200 && res.data.length > 0) {
        setStandard(res.data[0]);
      }
    });
  }, [subLessonID]);

  const standardInfoItems = useMemo<{ label: string; value: ReactNode }[]>(() => {
    return [
      { label: 'สาระการเรียนรู้', value: standard?.learning_content_name ?? '-' },
      { label: 'ตัวชี้วัด', value: standard?.indicator_name ?? '-' },
    ];
  }, [standard]);

  return (
    <div className="grid grid-cols-2 gap-y-2 rounded-tl-md rounded-tr-md bg-neutral-100 px-5 py-4 drop-shadow-md">
      {standardInfoItems.map((item, index) => (
        <Fragment key={`standard-info-${index}`}>
          <span className="text-sm">{item.label}</span>
          <span className="text-sm">{item.value}</span>
        </Fragment>
      ))}
    </div>
  );
};

export default SubLessonStandardInfo;
