import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import {
  ChangeEventHandler,
  FocusEventHandler,
  forwardRef,
  LegacyRef,
  MouseEventHandler,
} from 'react';
import { ChangeHandler, RefCallBack } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps<T extends string> {
  options?: SelectOption[];
  id?: string;
  className?: string;
  selectedValue?: string;
  placeholder?: string;
  onClick?: MouseEventHandler<HTMLSelectElement>;
  onChange?: ChangeHandler | ChangeEventHandler<HTMLSelectElement>;
  onBlur?: ChangeHandler | FocusEventHandler<HTMLSelectElement>;
  name?: T;
  required?: boolean;
  disabled?: boolean;
}

const Select = forwardRef(function Select<T extends string>(
  {
    id,
    className,
    selectedValue = '',
    placeholder,
    options = [],
    onChange,
    onBlur,
    name,
    required,
    disabled,
  }: SelectProps<T>,
  ref: LegacyRef<HTMLSelectElement> | RefCallBack | undefined,
) {
  return (
    <select
      id={id}
      ref={ref}
      name={name}
      className={cn(
        'form-select truncate !font-normal !text-[#0E1726]',
        { 'cursor-not-allowed opacity-50': disabled },
        className,
      )}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      disabled={disabled}
      value={selectedValue}
    >
      {placeholder && (
        <option className="!text-[#0E1726]/50" disabled value="">
          {placeholder}
        </option>
      )}
      {options.map(({ label, value }, i) => {
        return (
          <option key={i} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
});

export default Select;
