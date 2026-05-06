import React from 'react';
import Select from '../atom/wc-a-select';

export interface InputTextProps {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  options: { label?: any; value: any }[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SelectLabel(props: InputTextProps) {
  return (
    <div>
      <label htmlFor={props.name} className="!font-normal">
        <text className="text-red-600">{props.required ? '*' : ''}</text>
        {props.label}
      </label>
      <Select name={props.name} options={props.options} placeholder={props.placeholder} />
    </div>
  );
}
