interface SelectProps {
  name: string;
  options: { label?: any; value: any }[];
  value?: any;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const Select = function (props: SelectProps) {
  return (
    <select
      className={`form-select !font-normal text-white-dark ${props.className ?? ''}`}
      onChange={props.onChange}
      required={props.required}
    >
      {props.placeholder && (
        <option value="" disabled selected hidden>
          {props.placeholder}
        </option>
      )}
      {props.options.map((opt, index) => (
        <option key={'' + opt.value + index} value={opt.value}>
          {opt.label ?? opt.value}
        </option>
      ))}
    </select>
  );
};

export default Select;
