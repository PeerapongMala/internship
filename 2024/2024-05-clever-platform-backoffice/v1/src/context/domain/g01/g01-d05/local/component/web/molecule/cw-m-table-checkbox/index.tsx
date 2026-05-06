import CWACheckbox, { CWACheckboxProps } from '../../atom/cw-a-checkbox';

interface CWMTableCheckboxProps extends CWACheckboxProps {}

const CWMTableCheckbox = function (props: CWMTableCheckboxProps) {
  return (
    <CWACheckbox
      {...props}
      checked={props.checked}
      className={`!m-0 justify-center ${props.className ?? ''}`}
      inputClassName={`!m-0 ${props.inputClassName ?? ''}`}
    />
  );
};

export default CWMTableCheckbox;
