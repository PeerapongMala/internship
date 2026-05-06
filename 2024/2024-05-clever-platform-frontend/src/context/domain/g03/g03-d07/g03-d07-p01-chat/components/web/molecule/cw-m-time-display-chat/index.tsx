import { useMemo } from 'react';

import dayjs from 'dayjs';
import Line from '../../atom/cw-a-line';
import TimeDisplay from '../../atom/cw-a-time-display';

type TimeDisplayProps = {
  inputDate: dayjs.ConfigType;
};

const TimeDisplayChat = ({ inputDate }: TimeDisplayProps) => {
  function formatDate(inputDate: dayjs.ConfigType, dateFormat = 'YYYY-MM-DD HH:mm') {
    const date = dayjs(inputDate);
    const now = dayjs();

    const diffSeconds = Math.abs(now.diff(date, 'second'));
    const diffMinutes = Math.abs(now.diff(date, 'minute'));
    const diffHours = Math.abs(now.diff(date, 'hour'));

    if (diffSeconds < 60 && diffMinutes < 1) {
      return 'a second ago';
    }
    if (diffMinutes < 60 && diffHours < 1) {
      return `${diffMinutes} minute ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour ago`;
    }
    return date.format(dateFormat);
  }

  const formattedTime = useMemo(() => {
    return formatDate(inputDate);
  }, [inputDate]); // Recompute only when 'inputDate' changes

  return (
    <div className="my-2 flex w-full items-center gap-4 p-4">
      <Line className="flex-1" />
      <TimeDisplay inputDate={inputDate} type='day' />
      <Line className="flex-1" />
    </div>
  );
};

export default TimeDisplayChat;
