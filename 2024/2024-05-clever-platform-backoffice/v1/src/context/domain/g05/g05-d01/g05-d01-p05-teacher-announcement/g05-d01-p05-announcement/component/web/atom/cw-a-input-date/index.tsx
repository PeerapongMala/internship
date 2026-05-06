export interface CWAInputDateProps {
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CWAInputDate = function (props: CWAInputDateProps) {
  return (
    <input
      type="date"
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      className={`form-input !font-normal ${props.className ?? ''}`}
      onChange={props.onChange}
    />
  );
};

export default CWAInputDate;
