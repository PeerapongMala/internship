import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VectorNext from '../../../../assets/VectorNext.svg';
import VectorPrevius from '../../../../assets/VectorPre.svg';
import IconButton from '../wc-a-icon-button';

interface DateTimeProps {
  startDate: string;
  endDate: string;
  onDateChange: (newStartDate: string, newEndDate: string) => void;
}

type FilterType = 'week' | 'month';

export function DateTime({ startDate, endDate, onDateChange }: DateTimeProps) {
  const { t } = useTranslation(['global']);
  const [filterType, setFilterType] = useState<FilterType>('week');

  const formatDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    return { firstDay: sunday, lastDay: saturday };
  };


  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return { firstDay, lastDay };
  };

  const updateDates = (newStartDate: Date, newEndDate: Date) => {
    const start = formatDate(newStartDate);
    const end = formatDate(newEndDate);
    onDateChange(start, end);
  };

  const setWeekView = () => {
    if (filterType !== 'week') {
      setFilterType('week');
      const { firstDay, lastDay } = getCurrentWeekDates();
      updateDates(firstDay, lastDay);
    }
  };

  const setMonthView = () => {
    if (filterType !== 'month') {
      setFilterType('month');
      const { firstDay, lastDay } = getCurrentMonthDates();
      updateDates(firstDay, lastDay);
    }
  };

  useEffect(() => {
    const { firstDay, lastDay } = getCurrentWeekDates();
    updateDates(firstDay, lastDay);
  }, []);

  const getDateTypeRangeText = () => {
    const prefix =
      filterType === 'week' ? t('datetime.this_week') : t('datetime.this_month');
    return `${prefix}`;
  };

  const getDateRangeText = () => {
    const dates = filterType === 'week' ? getCurrentWeekDates() : getCurrentMonthDates();
    return `${formatDate(dates.firstDay)} - ${formatDate(dates.lastDay)}`;
  };

  return (
    <div className="flex items-center pl-3 w-full">
      <div className="flex items-center justify-between w-4/5">
        <IconButton
          iconSrc={VectorPrevius}
          width={44}
          height={44}
          style={{
            backgroundColor: filterType === 'week' ? '#ace4f2' : '#00c5ff',
            borderColor: '#ace4f2',
          }}
          onClick={setWeekView}
          aria-label="Switch to Week View"
        />

        <div className="px-6 text-2xl font-bold text-gray-20">
          {getDateTypeRangeText()}
        </div>

        <IconButton
          iconSrc={VectorNext}
          width={44}
          height={44}
          style={{
            backgroundColor: filterType === 'month' ? '#ace4f2' : '#00c5ff',
            borderColor: '#ace4f2',
          }}
          onClick={setMonthView}
          aria-label="Switch to Month View"
        />
      </div>
      <div className="w-3/5 px-6 text-2xl font-bold text-gray-20 text-right">
        {getDateRangeText()}
      </div>
    </div>
  );
}

export default DateTime;
