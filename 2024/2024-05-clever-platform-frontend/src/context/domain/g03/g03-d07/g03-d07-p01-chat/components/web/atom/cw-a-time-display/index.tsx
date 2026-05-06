import { useMemo } from 'react';

import { cn } from '@global/helper/cn';
import dayjs from 'dayjs';

type TimeDisplayProps = {
  type:string; // day time
  className?: string;
  inputDate: dayjs.ConfigType;
};

const TimeDisplay = ({ className, inputDate,type }: TimeDisplayProps) => {
  function formatDate(inputDate: dayjs.ConfigType, dateFormat = 'YYYY-MM-DD HH:mm') {
    const date = dayjs(inputDate);
    const now = dayjs();

    const diffSeconds = Math.abs(now.diff(date, 'second'));
    const diffMinutes = Math.abs(now.diff(date, 'minute'));
    const diffHours = Math.abs(now.diff(date, 'hour'));
    if(type === "day"){
      if (diffSeconds < 60 && diffMinutes < 1) {
        return 'a second ago';
      }
      if (diffMinutes < 60 && diffHours < 1) {
        return `${diffMinutes} minute ago`;
      }
      if (diffHours < 24) {
        return `${diffHours} hour ago`;
      }
    }
    return date.format(type==="day"?"DD-MM-YYYY":"HH:mm");
    // return date.format(dateFormat);
  }

  const formattedTime = useMemo(() => {
    return formatDate(inputDate);
  }, [inputDate]); // Recompute only when 'inputDate' changes

  return (
    <div className={cn('whitespace-nowrap text-gray-500', className)}>
      {formattedTime}
    </div>
  );
};

export default TimeDisplay;
