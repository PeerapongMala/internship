import { ChangeEvent, CSSProperties } from 'react';

import Checkbox from '../atoms/wc-a-checkbox';
import { TextNormal } from '../atoms/wc-a-text';

interface CheckboxWithLabelProps {
  id?: string;
  name?: string;
  onChange?: (x: ChangeEvent<HTMLInputElement>) => void;
  className?: { checkbox?: string; label?: string };
  style?: { checkbox?: CSSProperties; label?: CSSProperties };
  checked?: boolean;
  disabled?: boolean;
  label?: string;
}

export default function CheckboxWithLabel({
  id,
  name,
  onChange,
  className,
  style,
  checked,
  disabled,
  label,
}: CheckboxWithLabelProps) {
  return (
    <>
      <Checkbox id={id} checked={checked} disabled={disabled} onChange={onChange} />
      <label
        htmlFor={id}
        className={`${disabled ? '' : 'cursor-pointer'} ${className?.checkbox}`}
        style={style?.checkbox}
      >
        <TextNormal
          className={`${disabled ? 'text-gray-400' : ''} ${className?.label}`}
          style={style?.label}
        >
          {label}
        </TextNormal>
      </label>
    </>
  );
}
