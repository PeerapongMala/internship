import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string | number;
  className?: string;
  name?: string;
}

const CWInputRadio = ({
  onChange,
  required,
  label = '',
  placeholder,
  value,
  className = '',
  name,
  disabled,
  ...rest
}: InputProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="inline-flex w-fit items-center gap-1 !font-normal">
        <input
          type="radio"
          className="form-radio"
          disabled={disabled}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          name={name}
          {...rest}
        />
        <div className="">{label}</div>
      </label>
    </div>
  );
};

export default CWInputRadio;
