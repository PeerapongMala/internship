import dayjs from '@global/utils/dayjs';

interface TimeDisplayProps {
  time: Date;
}

const TimeDisplay = ({ time }: TimeDisplayProps) => {
  const now = dayjs();
  const messageDate = dayjs(time);
  let formattedDate: string;

  if (now.isSame(messageDate, 'day')) {
    formattedDate = 'Today';
  } else if (now.subtract(1, 'day').isSame(messageDate, 'day')) {
    formattedDate = 'Yesterday';
  } else if (now.isSame(messageDate, 'year')) {
    formattedDate = messageDate.format('D MMMM');
  } else {
    formattedDate = messageDate.format('D MMMM YYYY');
  }

  return (
    <div className="flex w-full items-center justify-between py-[20px]">
      {/* Left line */}
      <div className="h-[1px] flex-grow bg-gray-200"></div>

      {/* Centered date */}
      <div className="whitespace-nowrap px-2 font-nunito text-sm text-gray-600">
        {formattedDate}
      </div>

      {/* Right line */}
      <div className="h-[1px] flex-grow bg-gray-200"></div>
    </div>
  );
};

export default TimeDisplay;
