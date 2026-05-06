import { ChangeEvent, CSSProperties } from 'react';

import styles from './wc-a-checkbox.module.css';

interface CheckboxProps {
  id?: string;
  name?: string;
  onChange?: (x: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  style?: CSSProperties;
  checked?: boolean;
  disabled?: boolean;
}

export default function Checkbox({
  id = '',
  name = '',
  onChange,
  style = {},
  className = '',
  checked = false,
  disabled = false,
}: CheckboxProps) {
  return (
    <div
      className={
        `${styles['checkbox-wrapper']} box-border ` +
        `${disabled ? 'brightness-75 pointer-events-none' : ''} ` +
        `${className}`
      }
      style={style}
      data-disabled={disabled}
      data-checked={checked}
    >
      <input
        type="checkbox"
        id={id}
        title={name}
        checked={checked}
        className="w-0 h-0 z-[-10]"
        onChange={(evt) => {
          if (onChange) onChange(evt);
        }}
        disabled={disabled}
      />
      <label htmlFor={id} className="w-full h-full min-w-[32px] min-w-[32px]">
        <svg viewBox="0 0 12 12">
          <path d="M4 9.9L0 5.9L1.4 4.5L4 7.1L10.6 0.5L12 1.9L4 9.9Z" />
        </svg>
      </label>
    </div>
  );
}
