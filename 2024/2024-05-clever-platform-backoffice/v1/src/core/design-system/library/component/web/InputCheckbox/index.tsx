import React from 'react';

interface InputCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string | number;
  className?: string;
  id?: string;
}

const InputCheckbox = ({
  onChange,
  required,
  label = '',
  placeholder,
  value,
  className = '',
  id = '',
  ...rest
}: InputCheckboxProps) => {
  return (
    <div className={'flex items-center ' + className}>
      <label className="inline-flex w-fit items-center gap-1">
        <input
          type="checkbox"
          className="form-checkbox"
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          id={id}
          {...rest}
        />
        <div className="">{label}</div>
      </label>
    </div>
  );
};

export default InputCheckbox;
