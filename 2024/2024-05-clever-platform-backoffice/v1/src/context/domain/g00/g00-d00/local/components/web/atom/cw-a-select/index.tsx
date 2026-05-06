interface CWASelectProps {
  name: string;
  options: { label?: any; value: any }[];
  value?: any;
  className?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const CWASelect = function (props: CWASelectProps) {
  return (
    <select
      className={`form-select !font-normal text-white-dark ${props.className ?? ''}`}
      onChange={props.onChange}
      required={props.required}
    >
      {props.options.map((opt, index) => (
        <option
          key={'' + opt.value + index}
          value={opt.value}
          selected={props.value == opt.value}
        >
          {opt.label ?? opt.value}
        </option>
      ))}
    </select>
  );
};

export default CWASelect;
