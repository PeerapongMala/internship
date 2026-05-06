import { useState } from 'react';

interface CWASelectProps {
  name: string;
  options: Option[];
  value?: any;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export type Option = { label?: any; value: any; disabled?: boolean };

const CWASelect = function (props: CWASelectProps) {
  const [value, setValue] = useState(props.value ?? '!placeholder');
  return (
    <select
      className={`form-select !font-normal text-white-dark ${props.className ?? ''}`}
      onChange={props.onChange}
      required={props.required}
    >
      {props.placeholder && (
        <option value="!placeholder" hidden>
          {props.placeholder}
        </option>
      )}
      {props.options.map((opt, index) => (
        <option
          key={'' + opt.value + index}
          value={opt.value}
          selected={value == opt.value}
          disabled={opt.disabled}
        >
          {opt.label ?? opt.value}
        </option>
      ))}
      {/* {props.options.map((opt, index) => (<option key={`select-option-${opt.value}-${index}`} value={opt.value}>{opt.label ?? opt.value}</option>))} */}
    </select>
  );
};

export default CWASelect;
