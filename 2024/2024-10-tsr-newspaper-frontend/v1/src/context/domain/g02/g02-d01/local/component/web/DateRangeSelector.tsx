import { useState, useRef, useEffect } from 'react';
import CalendarIcon from '../../../local/icon/calendar.svg';
import CalendarDarkIcon from '../../../local/icon/celendar-dark.svg';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { CiClock1 } from 'react-icons/ci';
import { HiOutlineTrash } from 'react-icons/hi2';

interface DatePickerProps {
  label: string;
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

const DateRangeSelector = ({
  value,
  label,
  onChange,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [calendarPosition, setCalendarPosition] = useState({ left: 0, top: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!calendarRef.current || !calendarContentRef.current) return;

      const target = e.target as HTMLElement;
      if (
        !calendarRef.current.contains(target) &&
        !calendarContentRef.current.contains(target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (calendarRef.current && calendarContentRef.current && isCalendarOpen) {
        const inputRect = calendarRef.current.getBoundingClientRect();
        const calendarRect = calendarContentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let left = 0;
        if (inputRect.left + calendarRect.width > viewportWidth) {
          left = Math.max(0, viewportWidth - calendarRect.width - 16);
        } else {
          left = inputRect.left;
        }

        setCalendarPosition({
          left: left,
          top: inputRect.bottom + window.scrollY + 4,
        });

        // Add small delay before showing
        setTimeout(() => setIsPositioned(true), 50);
      }
    };

    if (isCalendarOpen) {
      setIsPositioned(false);
      updatePosition();
    }

    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isCalendarOpen]);

  const handleDateSelect = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    setSelectedDate(date);
    onChange?.(date);
    setIsCalendarOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onChange?.(today);
    setCurrentDate(today);
    setIsCalendarOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.(null);
    setCurrentDate(new Date());
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
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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
        className="w-[150px] h-[2.375rem] flex justify-between border border-[#737373] rounded-md cursor-pointer"
      >
        <span className="text-sm leading-5 text-[#414141] dark:text-[#D7D7D7] font-normal w-[98px] py-[9px] px-4">
          {value ? value.toLocaleDateString('th-TH') : label}
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
          className={`fixed bg-white rounded-lg shadow-lg px-4 py-1 z-50 w-[280px] dark:bg-[#414141] transition-opacity duration-150 border border-[#D2D2D2] ${isPositioned ? 'opacity-100' : 'opacity-0'}`}
          style={{
            left: `${calendarPosition.left}px`,
            top: `${calendarPosition.top}px`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
                )
              }
              className="p-1 hover:bg-gray-100 rounded"
            >
              <GoArrowLeft className="dark:text-[#D7D7D7]" size={20} />
            </button>
            <span className="font-semibold text-base dark:text-[#D7D7D7]">
              {`${months[currentDate.getMonth()]} ${currentDate.getFullYear() +543}`}
            </span>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
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

export default DateRangeSelector;
