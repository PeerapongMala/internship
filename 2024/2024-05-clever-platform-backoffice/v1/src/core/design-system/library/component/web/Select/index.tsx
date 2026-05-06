import React from 'react';

interface Option {
  value: any;
  label: string;
}

interface InputSelectProps {
  options: Option[];
  onChange?: (selectedValue: any) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
  title?: string;
}

const Select = ({
  options,
  onChange,
  required,
  disabled,
  label,
  title,
  className = '',
}: InputSelectProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={`font-noto-sans-thai ${className}`}>
      {typeof label === 'string' && (
        <div className="">
          {required && <span className="text-red-500">*</span>}
          {label}:
        </div>
      )}
      {/* if label is react node */}
      {label && typeof label !== 'string' && (
        <div className="flex">
          {required && <span className="text-red-500">*</span>}
          {label}
        </div>
      )}

      <select
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className="form-select mt-1.5 font-noto-sans-thai"
      >
        {/* Add an option for an empty value */}
        <option value="" className="font-noto-sans-thai">
          {title ? title : 'กรุณาเลือก'}
        </option>

        {/* Render the actual options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="font-noto-sans-thai text-sm"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
