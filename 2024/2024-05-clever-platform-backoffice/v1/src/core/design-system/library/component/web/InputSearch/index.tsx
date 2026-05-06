import IconSearch from '../../icon/IconSearch';
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
}

const InputSearch = ({
  onChange,
  required,
  label,
  placeholder,
  type = 'text',
  value,
  className = '',
  disabled,
  ...rest
}: InputProps) => {
  return (
    <div className={`font-noto-sans-thai ${className}`}>
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
      <div className="relative ml-2 w-[200px]">
        <input
          className={`form-input mt-1.5 w-full ${className} ${disabled ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]' : ''} `}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
          disabled={disabled}
          {...rest}
        />
        <button type="button" className="!absolute right-0 top-0.5 mr-2 h-full">
          <IconSearch className="!h-5 !w-5" />
        </button>
      </div>
    </div>
  );
};

export default InputSearch;
