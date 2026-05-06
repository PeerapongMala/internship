import { CSSProperties } from 'react';

import styles from './wc-a-checkbox.module.css';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onChange?: (x: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

export default function Checkbox({
  id,
  checked,
  onChange,
  className,
  style,
}: CheckboxProps) {
  return (
    <div
      className={`${styles['checkbox-wrapper']} box-border ${className}`}
      style={style}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        className="w-0 h-0 z-[-10]"
        onChange={(evt) => {
          if (onChange) onChange(evt.currentTarget.checked);
        }}
      />
      <label htmlFor={id} className="w-full h-full min-w-[32px] min-w-[32px]">
        <svg viewBox="0 0 12 12">
          <path d="M4 9.9L0 5.9L1.4 4.5L4 7.1L10.6 0.5L12 1.9L4 9.9Z" />
        </svg>
      </label>
    </div>
  );
}
