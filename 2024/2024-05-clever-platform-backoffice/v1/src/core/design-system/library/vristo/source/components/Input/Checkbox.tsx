import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  className?: string;
  checked?: boolean;
}

const InputCheckbox = ({
  onChange,
  required,
  label = '',
  placeholder,
  className = '',
  checked,
  ...rest
}: InputProps) => {
  return (
    <div className={'flex items-center ' + className}>
      <label className="inline-flex w-fit items-center gap-1">
        <input
          type="checkbox"
          className="form-checkbox"
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          checked={checked}
          {...rest}
        />
        <div className="">{label}</div>
      </label>
    </div>
  );
};

export default InputCheckbox;
