import { useMemo } from 'react';
import dayjs from '../../../../../../../../global/utils/dayjs';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type TimeDisplayProps = {
  className?: string;
  inputDate: dayjs.ConfigType;
};

const TimeDisplayChat = ({ className, inputDate }: TimeDisplayProps) => {
  function formatDate(inputDate: dayjs.ConfigType, dateFormat = 'YYYY-MM-DD HH:mm') {
    const date = dayjs(inputDate);
    const now = dayjs();

    // const diffSeconds = Math.abs(now.diff(date, 'second'));
    // const diffMinutes = Math.abs(now.diff(date, 'minute'));
    // const diffHours = Math.abs(now.diff(date, 'hour'));

    // if (diffSeconds < 60 && diffMinutes < 1) {
    //   return 'a second ago';
    // }
    // if (diffMinutes < 60 && diffHours < 1) {
    //   return `${diffMinutes} minute ago`;
    // }
    // if (diffHours < 24) {
    //   return `${diffHours} hour ago`;
    // }
    return date.format('HH:mm');
    // return date.format(dateFormat);
  }

  const formattedTime = useMemo(() => {
    return formatDate(inputDate);
  }, [inputDate]); // Recompute only when 'inputDate' changes

  return <div className={cn('text-gray-500', className)}>{formattedTime}</div>;
};

export default TimeDisplayChat;
