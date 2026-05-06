import React, { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  className?: string;
}

const CWInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onChange,
      required,
      label,
      placeholder,
      type = 'text',
      value,
      className = '',
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleTogglePassword = () => {
      setIsShowPassword((prev) => !prev);
    };

    // Only override `type` if the original type is "password" and `isShowPassword` is true
    const inputType = type === 'password' && isShowPassword ? 'text' : type;

    return (
      <div className={`font-noto-sans-thai ${className} relative`}>
        {/* If label is a string */}
        {typeof label === 'string' && (
          <div>
            {required && <span className="text-red-500">*</span>}
            {label}
          </div>
        )}

        {/* If label is a React node */}
        {label && typeof label !== 'string' && (
          <div className="my-2 flex">
            {required && <span className="text-red-500">*</span>}
            {label}
          </div>
        )}

        <input
          ref={ref}
          className={`form-input w-full ${label ? 'mt-1.5' : 'mt-0'} ${className} ${
            disabled
              ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]'
              : ''
          } pr-10`}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          type={inputType}
          value={value}
          disabled={disabled}
          {...rest}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="-translate-y-2/2 absolute right-3 top-1/2 transform text-primary"
          >
            {isShowPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>
    );
  },
);

export default CWInput;
