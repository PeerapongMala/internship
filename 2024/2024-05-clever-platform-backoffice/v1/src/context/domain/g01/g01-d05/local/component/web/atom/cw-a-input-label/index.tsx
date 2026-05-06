export interface CWAInputLabelProps {
  name?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  required?: boolean;
}

const CWAInputLabel = function (props: CWAInputLabelProps) {
  return (
    <label htmlFor={props.name} className={`flex font-normal ${props.className}`}>
      {props.required && <span className="text-danger">*</span>}
      {props.label ?? props.children}
    </label>
  );
};

export default CWAInputLabel;
