import Label from '../../../../../local/component/web/atom/Label';
import CWInput from '@component/web/cw-input';
import { ChangeEvent } from 'react';

interface FormRowProps {
  label?: string;
  value: string | number;
  onChange?: (value: string) => void;
  classNameInput?: string;
  classNameLabel?: string;
  className?: string;
  labelAfter?: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'password' | 'date';
  placeholder?: string;
  error?: string | boolean;
}

export default function FormRow({
  label,
  value,
  onChange,
  classNameInput = '',
  classNameLabel = '',
  className = '',
  labelAfter,
  editable = false,
  type = 'text',
  placeholder,
  error,
}: FormRowProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      {label && <Label className={`${classNameLabel} `} text={label} />}
      <CWInput
        className={`${classNameInput} ${editable ? 'disabled:pointer-events-none disabled:bg-[#eee]' : ''}`}
        value={value?.toString?.()}
        onChange={handleInputChange}
        disabled={editable}
        type={type}
        placeholder={placeholder}
        error={error}
      />
      {labelAfter && <Label className={`${classNameLabel} pr-4`} text={labelAfter} />}
    </div>
  );
}
