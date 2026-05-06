export interface InputTextProps {
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
}

const InputText = function (props: InputTextProps) {
  return (
    <input
      type="text"
      id={props.name}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      className={`form-input !font-normal ${props.className ?? ''}`}
      onChange={props.onChange}
      onInput={props.onInput}
    />
  );
};

export default InputText;
