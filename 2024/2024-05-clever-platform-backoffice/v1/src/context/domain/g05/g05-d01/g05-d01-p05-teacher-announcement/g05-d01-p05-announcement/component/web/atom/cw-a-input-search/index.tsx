import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  className?: string;
  onClick?: () => void;

  /**
   * The width of the input field, used to generate Tailwind's `w-` class.
   *
   * This value should correspond to a valid Tailwind width class (without the `w-` prefix),
   * such as:
   * - `20` for `w-20` (width of 5rem)
   * - `40` for `w-40` (width of 10rem)
   * - `50` for `w-50` (width of 12.5rem)
   * - `full` for `w-full` (100% width of the parent)
   *
   * Example usage:
   * - `inputWidth="20"` → translates to `w-20`
   * - `inputWidth="50"` → translates to `w-50`
   * - `inputWidth="full"` → translates to `w-full`
   */
  inputWidth?: string;
}

const CWAInputSearch = ({
  name,
  onChange,
  onClick,
  required,
  label,
  placeholder,
  type = 'text',
  value,
  className = '',
  disabled,
  inputWidth,
  ...rest
}: InputProps) => {
  return (
    <div className={`font-noto-sans-thai ${className} w-full`}>
      {/* if label is string */}
      {typeof label === 'string' && (
        <div className="">
          {required && <span className="text-red-500">*</span>}
          {label}:
        </div>
      )}

      {/* if label is react node */}
      {label && typeof label !== 'string' && (
        <div className="my-2 flex">
          {required && <span className="text-red-500">*</span>}
          {label}
        </div>
      )}
      <div className={cn('relative w-full', inputWidth ? `w-${inputWidth}` : '')}>
        <input
          name={name}
          className={`form-input w-full ${label ? 'mt-1.5' : 'mt-0'} ${className} ${
            disabled
              ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]'
              : ''
          } `}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
          disabled={disabled}
          {...rest}
        />
        <button
          type="button"
          className={`!absolute right-0 ${label ? 'top-0.5' : 'top-0'} mr-2 flex h-full items-center justify-center`}
          onClick={onClick}
        >
          <IconSearch className="!h-5 !w-5" />
        </button>
      </div>
    </div>
  );
};

export default CWAInputSearch;
