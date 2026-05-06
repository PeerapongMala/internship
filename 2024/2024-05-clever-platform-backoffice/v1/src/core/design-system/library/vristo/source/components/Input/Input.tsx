import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import IconEye from '../Icon/IconEye';
import IconEyeOff from '../Icon/IconEye';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  className?: string;
  suffix?: React.ReactNode;
  rootClassName?: string;
  inputClassName?: string;
}

const Input = ({
  onChange,
  required,
  label,
  placeholder,
  type = 'text',
  value,
  className = '',
  disabled,
  onInput,
  suffix,
  rootClassName = '',
  inputClassName,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn(className, rootClassName)}>
      {/* if label is string */}
      {typeof label === 'string' && (
        <div className="my-2 text-base">
          {required && <span className="text-red-500">* </span>}
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
      <div className="relative flex items-center">
        <input
          className={cn(
            'form-input h-9 w-full font-normal',
            disabled
              ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]'
              : '',
            suffix ? '!pr-10' : '',
            className,
            inputClassName,
          )}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          disabled={disabled}
          onInput={onInput}
          {...rest}
        />
        {type === 'password' && (
          <div
            className="absolute right-0 flex cursor-pointer items-center pr-3"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <IconEyeOff className="h-5 w-5" />
            ) : (
              <IconEye className="h-5 w-5" />
            )}
          </div>
        )}
        {suffix && (
          <div className="absolute right-0 flex items-center pr-3">{suffix}</div>
        )}
      </div>
    </div>
  );
};

export default Input;
