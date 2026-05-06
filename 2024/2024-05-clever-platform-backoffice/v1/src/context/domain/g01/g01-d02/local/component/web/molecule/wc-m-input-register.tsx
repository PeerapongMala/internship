import { HTMLInputTypeAttribute } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Input from '../atom/wc-a-input';

interface InputRegisterProps<T extends string> {
  register: UseFormRegisterReturn<T>;
  type?: HTMLInputTypeAttribute;
  id?: string;
  className?: string;
  placeholder?: string;
}

function InputRegister<T extends string>({
  register,
  type = 'text',
  id,
  className,
  placeholder,
}: InputRegisterProps<T>) {
  const {
    onChange,
    onBlur,
    ref,
    name,
    required,
    disabled,
    min,
    max,
    maxLength,
    minLength,
    pattern,
  } = register;

  return (
    <Input
      type={type}
      id={id}
      ref={ref}
      name={name}
      className={className}
      onChange={onChange}
      onBlur={onBlur}
      min={min}
      max={max}
      maxLength={maxLength}
      minLength={minLength}
      pattern={pattern}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

export default InputRegister;
