import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { forwardRef, HTMLInputTypeAttribute, LegacyRef } from 'react';
import { ChangeHandler, RefCallBack } from 'react-hook-form';

interface InputProps<T extends string> {
  type?: HTMLInputTypeAttribute;
  id?: string;
  className?: string;
  placeholder?: string;
  onChange?: ChangeHandler | ((...event: any) => any);
  onBlur?: ChangeHandler | ((...event: any) => any);
  ref?: RefCallBack;
  name?: T;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  value?: string;
}

const Input = forwardRef(function Input<T extends string>(
  {
    type = 'text',
    id,
    className,
    placeholder,
    onChange,
    onBlur,
    name,
    required,
    disabled,
    min,
    max,
    maxLength,
    minLength,
    pattern,
    value,
  }: InputProps<T>,
  ref: LegacyRef<HTMLInputElement> | RefCallBack | undefined,
) {
  return (
    <input
      type={type}
      id={id}
      ref={ref}
      name={name}
      className={cn('form-input truncate !font-normal !text-[#0E1726]', className, {
        'cursor-not-allowed opacity-50': disabled,
      })}
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
      value={value}
    />
  );
});

export default Input;
