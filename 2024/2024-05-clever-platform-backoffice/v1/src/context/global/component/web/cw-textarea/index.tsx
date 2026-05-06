import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  className?: string;
  classNameTextarea?: string;
}

const CWTextArea = ({
  onChange,
  required,
  label,
  placeholder,
  type = 'text',
  value,
  className = '',
  classNameTextarea = '',
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
      <textarea
        className={`form-input mt-1.5 w-full ${classNameTextarea} ${disabled ? 'cursor-not-allowed disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]' : ''} `}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        {...rest}
      ></textarea>
    </div>
  );
};

export default CWTextArea;
