import { WCAInputDateFlat } from '@global/component/web/atom/wc-a-input-date';
import { useEffect, useState, useCallback } from 'react';
import CWInput from '@component/web/cw-input';
import { fromISODateToYYYYMMDD } from '@global/utils/date';

interface InputDateProps {
  className?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (date: string) => void;
}

const InputDateTime = ({
  value,
  label,
  placeholder,
  required,
  onChange,
}: InputDateProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');

  useEffect(() => {
    if (value) {
      const initDate = new Date(value);
      const initTime = initDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setDate(initDate);
      setTime(initTime);
    }
  }, [value]);

  useEffect(() => {
    if (date && time) {
      const stringDate = fromISODateToYYYYMMDD(date.toISOString());
      const combinedDateTime = new Date(`${stringDate}T${time}`);
      // console.log('result date TH : ', toDateTimeTH(combinedDate))
      // console.log('result date ISO: ', combinedDate.toISOString())
      onChange(combinedDateTime.toISOString());
    } else if (!date || !time) {
      onChange('');
    }
  }, [date, time]);

  const handleDateChange = useCallback((dates: Date[]) => {
    setDate(dates[0]);
  }, []);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  }, []);

  return (
    <div className="mt-4 grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
      <div className="flex w-full flex-col gap-1.5">
        <p>
          {required && <span className="text-red-500">*</span>}
          {label}
        </p>
        <div className="relative max-w-[360px]">
          <WCAInputDateFlat
            placeholder={placeholder}
            className=""
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <CWInput type="time" value={time} onChange={handleTimeChange} className="w-full" />
    </div>
  );
};

export default InputDateTime;
