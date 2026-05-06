import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';
import { Thai } from 'flatpickr/dist/l10n/th.js';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { useEffect, useState } from 'react';
import IconCalendar from '@core/design-system/library/component/icon/IconCalendar';

export interface WCAInputDateProps {
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface WCAInputDateFlatProps extends DateTimePickerProps {
  className?: string;
  placeholder?: string;
  onChange?: (dates: Date[]) => void;
  name?: string;
  label?: string;
}

const WCAInputDate = function (props: WCAInputDateProps) {
  return (
    <input
      type="date"
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      className={`form-input !font-normal ${props.className ?? ''}`}
      onChange={props.onChange}
    />
  );
};

// million-ignore
const WCAInputDateFlat = ({
  className,
  placeholder,
  onChange,
  options,
  value,
  name = '',
  label,
  disabled,
  hideIcon = false,
  ...props
}: WCAInputDateFlatProps & { hideIcon?: boolean }) => {
  const [date, setDate] = useState<Date[] | undefined>();
  const handleChangeDate = (dates: Date[]) => {
    setDate(dates);
    onChange && onChange(dates);
  };

  useEffect(() => {
    if (value) {
      setDate(
        Array.isArray(value)
          ? value.map((v) => new Date(v as string | number | Date))
          : [new Date(value as string | number | Date)],
      );
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span>
          {props.required && <span className="text-red-500">*</span>}
          {label}
        </span>
      )}
      <div className="relative">
        <Flatpickr
          placeholder={placeholder ? placeholder : 'วว/ดด/ปปปป'}
          className={cn(
            'h-[38px] w-full overflow-hidden rounded-md border border-neutral-200 p-3',
            className,
          )}
          options={{
            mode: 'single',
            dateFormat: 'd/m/Y',
            locale: {
              ...Thai,
            },
            ...options,
          }}
          onChange={handleChangeDate}
          value={date}
          name={name}
          disabled={disabled}
          {...props}
        />
        {!hideIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <IconCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default WCAInputDate;
export { WCAInputDateFlat };
