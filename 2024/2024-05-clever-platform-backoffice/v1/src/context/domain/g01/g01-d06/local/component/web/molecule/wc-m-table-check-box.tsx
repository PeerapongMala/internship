import Checkbox, { CheckboxProps } from '../atom/wc-a-checkbox';

interface CWMTableCheckboxProps extends CheckboxProps {}

const TableCheckbox = function (props: CWMTableCheckboxProps) {
  return (
    <Checkbox
      {...props}
      checked={props.checked}
      className={`!m-0 justify-center ${props.className ?? ''}`}
      inputClassName={`!m-0 ${props.inputClassName ?? ''}`}
    />
  );
};

export default TableCheckbox;
