import CWInput from '@component/web/cw-input';
import React, { useState } from 'react';

interface ValidatedInputProps {
  label?: React.ReactNode;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  className?: string;
  errorMessage?: string;
}

const ValidatedInput = ({
  label,
  value,
  onChange,
  required = false,
  disabled,
  placeholder,
  type = 'text',
  className = '',
  errorMessage = 'กรุณากรอกข้อมูล',
  ...rest
}: ValidatedInputProps) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange');
    setTouched(true);
    console.log('e.target.value', e.target.value);
    // Validate
    if (required && !e.target.value) {
      setError(errorMessage);
    } else {
      setError('');
    }

    // Call original onChange
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = () => {
    setTouched(true);

    // Validate on blur
    if (required && (!value || value.toString().trim() === '')) {
      setError(errorMessage);
    }
  };

  return (
    <div className="relative">
      <CWInput
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        className={`${className} ${error && touched ? 'border-red-500' : ''}`}
        {...rest}
      />
      {error && touched && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default ValidatedInput;
