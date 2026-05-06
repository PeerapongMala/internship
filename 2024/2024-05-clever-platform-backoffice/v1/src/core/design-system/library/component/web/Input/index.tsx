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

const Input = ({
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
    </div>
  );
};

export default Input;
