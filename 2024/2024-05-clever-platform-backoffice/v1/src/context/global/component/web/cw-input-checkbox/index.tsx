import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import React from 'react';

interface InputCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string | number;
  className?: string;
  classNameInput?: string
  whiteBackground?: boolean;
}
// million-ignore
const CWInputCheckbox = ({
  onChange,
  required,
  label = '',
  placeholder,
  value,
  className = '',
  classNameInput = '',
  checked,
  whiteBackground = false,
  ...rest
}: InputCheckboxProps) => {
  return (
    <div className={'flex items-center ' + className}>
      <label className="m-0 inline-flex w-fit items-center gap-1">
        <input
          type="checkbox"
          style={{
            height: '1.25rem',
            width: '1.25rem',
            borderRadius: '0.25rem',
            border: checked ? ' 2px solid #4361ee' : ' 2px solid #e0e6ed',
            backgroundColor: checked
              ? '#4361ee'
              : whiteBackground ? '#fff' : 'transparent',
            backgroundImage: checked
              ? "url(\"data:image/svg+xml,<svg viewBox='0 0 16 16' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/></svg>\")"
              : 'none',
            backgroundSize: '90% 90%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          className={cn(
            'form-checkbox',
            classNameInput
          )}
          required={required}
          onChange={onChange}
          checked={checked}
          placeholder={placeholder}
          value={value}
          {...rest}
        />
        <div className="">{label}</div>
      </label>
    </div>
  );
};

export default CWInputCheckbox;
