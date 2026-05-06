import { cn } from '@global/helper/cn';
import { Key } from 'react';

interface Option {
  key?: Key | null;
  value: string | number | readonly string[] | undefined;
  label: string;
}

interface InputSelectProps {
  options?: Option[];
  onChange?: (selectedValue: any) => void;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  className?: string;
  title?: string;
}

// million-ignore
const CWSelect = ({
  options,
  onChange,
  required,
  disabled,
  title,
  value,
  className = '',
}: InputSelectProps) => {
  return (
    <div>
      <select
        value={value || ''}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        disabled={disabled}
        required={required}
        className={cn(
          `form-select w-full rounded-md border border-neutral-200 pl-1 pr-4`,
          className,
        )}
      >
        {/* Add an option for an empty value */}
        <option value="" className="font-noto">
          {title ? title : 'กรุณาเลือก'}
        </option>

        {/* Render the actual options */}
        {options?.map((option) => (
          <option
            key={option.key ?? option.value?.toString()}
            value={option.value}
            className="font-noto text-sm"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CWSelect;
