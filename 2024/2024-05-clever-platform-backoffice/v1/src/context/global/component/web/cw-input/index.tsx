import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  className?: string;
  inputClassName?: string;
  name?: string;
  error?: string | boolean;
  maxDate?: string;
  maxLength?: number;
  onClear?: () => void;
  disabledWhiteBg?: boolean;
}

// million-ignore
const CWInput = ({
  onChange,
  onClick,
  required,
  label,
  placeholder = '',
  type = 'text',
  value,
  className = '',
  inputClassName,
  disabled,
  readOnly,
  name = '',
  error,
  maxDate,
  maxLength,
  onClear,
  step,
  min,
  disabledWhiteBg = false,
  ...rest
}: InputProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setIsShowPassword(!isShowPassword);
  };
  const handleClear = () => {
    if (onChange) {
      const event = {
        target: {
          name: name,
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    if (onClear) {
      onClear();
    }
  };
  const checkRequiredPlaceholder =
    required && !placeholder ? 'โปรดกรอกข้อมูล' : placeholder;

  const calculatedMaxDate =
    type === 'date' && !maxDate ? new Date().toISOString().split('T')[0] : maxDate;

  // clear value
  const hasValue = value !== undefined && value !== null && value !== '' && value !== 0;

  return (
    <div className={`font-noto-sans-thai ${className} relative`}>
      {/* if label is string */}
      {typeof label === 'string' && (
        <div className="">
          {required && <span className="text-red-500">*</span>}
          {label}
        </div>
      )}

      {/* if label is react node */}
      {label && typeof label !== 'string' && (
        <div className="my-2 flex">
          {required && <span className="text-red-500">*</span>}
          {label}
        </div>
      )}
      <div className="relative">
        <input
          readOnly={readOnly}
          name={name}
          className={cn(
            `form-input ${label ? 'mt-1.5' : ''} w-full pr-10 ${
              disabled
                ? `cursor-not-allowed disabled:pointer-events-none ${
                    disabledWhiteBg
                      ? 'disabled:bg-white dark:disabled:bg-white'
                      : 'disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]'
                  }`
                : ''
            } ${error ? '!border-2 !border-red-500 focus:!border-red-500' : 'outline-none active:!border-primary'} h-9 transition-colors duration-200 ease-in-out`,
            inputClassName,
          )}
          required={required}
          onChange={onChange}
          onClick={onClick}
          placeholder={checkRequiredPlaceholder}
          type={type === 'password' && isShowPassword ? 'text' : type}
          value={value}
          disabled={disabled}
          max={calculatedMaxDate}
          maxLength={maxLength !== undefined ? maxLength : undefined}
          step={step}
          min={min}
          {...rest}
        />

        {onClear && hasValue && type !== 'password' && !readOnly && (
          <button
            type="button"
            onClick={handleClear}
            className="!important absolute right-3 top-[7px] z-10 text-gray-400 hover:text-gray-600"
          >
            <IconX />
          </button>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-[15px] text-primary"
          >
            {isShowPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>
      {typeof error === 'string' && <p className="mt-1.5 pl-1.5 text-red-400">{error}</p>}
    </div>
  );
};

export default CWInput;
