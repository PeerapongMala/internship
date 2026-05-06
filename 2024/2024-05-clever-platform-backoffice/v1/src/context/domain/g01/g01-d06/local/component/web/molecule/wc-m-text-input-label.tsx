import React from 'react';
import InputText from '../atom/wc-a-text-input';

export interface InputTextProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function TextInputLabel(props: InputTextProps) {
  return (
    <div>
      <label htmlFor={props.name} className="!font-normal">
        <text className="text-red-600">{props.required ? '*' : ''}</text>
        {props.label}
      </label>
      <InputText {...props} />
    </div>
  );
}
