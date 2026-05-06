import CWAInputLabel from '@domain/g01/g01-d05/local/component/web/atom/cw-a-input-label';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface InputProps {
  label?: string;
  required?: boolean;
  className?: string;
  value?: any;
  inputClassName?: any;
  onChange?: (value: string) => void;
  readonly?: boolean;
  disabled?: boolean;
}

const CWEditor = ({ className = '', ...props }: InputProps) => {
  return (
    <div className={`${className ?? ''}`}>
      {props.label && <CWAInputLabel label={props.label} required={props.required} />}
      <ReactQuill
        value={props.value}
        onChange={(content: any) => props.onChange?.(content)}
        className={`${props.inputClassName ?? ''}`}
        theme="snow"
        readOnly={props.disabled || props.readonly}
      />
    </div>
  );
};

export default CWEditor;
