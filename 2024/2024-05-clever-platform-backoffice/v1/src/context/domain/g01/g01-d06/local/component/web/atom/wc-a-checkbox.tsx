export interface CheckboxProps {
  group: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox = function (props: CheckboxProps) {
  return (
    <label className={`flex gap-2 ${props.className ?? ''}`}>
      <input
        data-group={`checkbox-${props.group}`}
        type="checkbox"
        className={`form-checkbox ${props.inputClassName ?? ''}`}
        checked={props.checked ?? false}
        onChange={props.onChange}
      />
      {props.label && <span>{props.label}</span>}
    </label>
  );
};

export default Checkbox;
