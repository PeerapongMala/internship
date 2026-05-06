export interface CWAInputTextProps {
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onInput?: React.ChangeEventHandler<HTMLInputElement>;
}

const CWAInputText = function (props: CWAInputTextProps) {
  return (
    <input
      type="text"
      name={props.name}
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      className={`form-input !font-normal ${props.className ?? ''}`}
      onChange={props.onChange}
      onInput={props.onInput}
    />
  );
};

export default CWAInputText;
