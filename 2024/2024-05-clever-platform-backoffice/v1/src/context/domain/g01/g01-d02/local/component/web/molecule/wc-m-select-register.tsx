import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { UseFormRegisterReturn } from 'react-hook-form';
import Select from '../atom/wc-a-select';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectRegisterProps<T extends string> {
  register: UseFormRegisterReturn<T>;
  options?: SelectOption[];
  id?: string;
  className?: string;
  selectedValue?: string;
  placeholder?: string;
}

function SelectRegister<T extends string>({
  register,
  options = [],
  id,
  className,
  selectedValue = '',
  placeholder,
}: SelectRegisterProps<T>) {
  const { onChange, onBlur, ref, name, required, disabled } = register;
  return (
    <Select
      id={id}
      ref={ref}
      name={name}
      className={className}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      disabled={disabled}
      selectedValue={selectedValue}
      placeholder={placeholder}
      options={options}
    />
  );
}

export default SelectRegister;
