import { useState, useRef, useEffect } from 'react';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { CiClock1 } from 'react-icons/ci';
import { HiOutlineTrash } from 'react-icons/hi2';

interface DatePickerProps {
  placeholder: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
}
const weekDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const CalendarIcon = () => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16667 3.8335H15.8333C16.7538 3.8335 17.5 4.57969 17.5 5.50016V17.1668C17.5 18.0873 16.7538 18.8335 15.8333 18.8335H4.16667C3.24619 18.8335 2.5 18.0873 2.5 17.1668V5.50016C2.5 4.57969 3.24619 3.8335 4.16667 3.8335Z"
        stroke="#414141"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.66663 2.1665V5.49984"
        stroke="#414141"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.3334 2.1665V5.49984"
        stroke="#414141"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.5 8.8335H2.5"
        stroke="#414141"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const CalendarDarkIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16667 3.3335H15.8333C16.7538 3.3335 17.5 4.07969 17.5 5.00016V16.6668C17.5 17.5873 16.7538 18.3335 15.8333 18.3335H4.16667C3.24619 18.3335 2.5 17.5873 2.5 16.6668V5.00016C2.5 4.07969 3.24619 3.3335 4.16667 3.3335Z"
        stroke="#D7D7D7"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.6665 1.6665V4.99984"
        stroke="#D7D7D7"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.3335 1.6665V4.99984"
        stroke="#D7D7D7"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.5 8.3335H2.5"
        stroke="#D7D7D7"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const DateRangeSelectorApprove = ({
  value,
  placeholder,
  onChange,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [displayedDate, setDisplayedDate] = useState<Date>(value || new Date());

  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setDisplayedDate(value);
    }
  }, [value]);

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return placeholder;
    return isToday(date) ? 'วันนี้' : date.toLocaleDateString('th-TH');
  };

  const handleClear = () => {
    onChange?.(null);
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(
      value?.getFullYear() || new Date().getFullYear(),
      value?.getMonth() || new Date().getMonth(),
      day,
    );

    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    onChange?.(date);
    setIsCalendarOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    onChange?.(today);
    setIsCalendarOpen(false);
  };

  const isDateDisabled = (date: Date) => {
    const compareDate = new Date(date.getTime());
    compareDate.setHours(0, 0, 0, 0);

    if (minDate) {
      const min = new Date(minDate.getTime());
      min.setHours(0, 0, 0, 0);
      if (compareDate < min) return true;
    }

    if (maxDate) {
      const max = new Date(maxDate.getTime());
      max.setHours(0, 0, 0, 0);
      if (compareDate > max) return true;
    }

    return false;
  };

  const RenderCalendar = () => {
    const year = displayedDate.getFullYear();
    const month = displayedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <button
          key={`prev-${i}`}
          disabled
          className="text-gray-300 text-base dark:text-neutral-500"
        >
          {new Date(year, month, -firstDay + i + 1).getDate()}
        </button>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        value &&
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear();

      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={`current-${day}`}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`
            h-8 w-8 text-base rounded-full dark:text-[#fff]
            ${isSelected ? 'bg-[#D9A84E] text-white hover:bg-[#D9A84E]' : 'hover:bg-gray-100'}
            ${
              disabled
                ? 'bg-gray-100 dark:bg-[#414141] text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 '
                : 'cursor-pointer'
            }
          `}
        >
          {day}
        </button>,
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <button
          key={`next-${i}`}
          disabled
          className="text-gray-300 text-base dark:text-neutral-500"
        >
          {i}
        </button>,
      );
    }

    return days;
  };

  return (
    <div ref={calendarRef} className="relative">
      <div
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="w-[184px] h-[2.375rem] flex justify-between border border-[#737373] rounded-md cursor-pointer"
      >
        <span className="text-sm leading-5 text-[#414141] dark:text-[#D7D7D7] font-normal w-[132px] py-[9px] px-4">
          {formatDate(value)}
        </span>
        <div className="w-9 h-9 flex items-center justify-center">
          <div className="w-5 h-5 dark:hidden">
            <CalendarIcon />
          </div>
          <div className="w-5 h-5 hidden dark:block">
            <CalendarDarkIcon />
          </div>
        </div>
      </div>

      {isCalendarOpen && (
        <div
          ref={calendarContentRef}
          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg px-4 py-1 z-50 w-[280px] dark:bg-[#414141]"
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() =>
                setDisplayedDate(
                  new Date(displayedDate.getFullYear(), displayedDate.getMonth() - 1),
                )
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              <GoArrowLeft className="dark:text-[#D7D7D7]" size={20} />
            </button>
            <span className="font-semibold text-base dark:text-[#D7D7D7]">
              {`${months[displayedDate.getMonth()]} ${displayedDate.getFullYear()+ 543}`}
            </span>
            <button
              onClick={() =>
                setDisplayedDate(
                  new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1),
                )
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              <GoArrowRight className="dark:text-[#D7D7D7]" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">{<RenderCalendar />}</div>
          <div className="flex justify-between mt-2 p-2 border-t">
            <button
              onClick={handleSelectToday}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <CiClock1 className="dark:text-[#D7D7D7]" size={20} />
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <HiOutlineTrash className="dark:text-[#D7D7D7]" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelectorApprove;
