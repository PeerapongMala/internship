import React from 'react';
import { cn } from '../../utils/cn';

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

const InputRadioTab = ({
  onChange,
  required,
  label = '',
  placeholder,
  value,
  className = '',
  name,
  checked,
  ...rest
}: InputProps) => {
  return (
    <div className={'flex items-center'}>
      <label
        className={cn(
          'inline-flex w-fit cursor-pointer items-center gap-1 border p-2 font-bold transition-all duration-100',
          checked ? 'bg-primary text-white' : 'bg-white',
          className,
        )}
      >
        <input
          type="radio"
          className="form-radio !hidden"
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

export default InputRadioTab;
