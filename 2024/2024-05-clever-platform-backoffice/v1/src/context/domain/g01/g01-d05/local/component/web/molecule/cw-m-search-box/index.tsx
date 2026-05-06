import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import CWAInputText, { CWAInputTextProps } from '../../atom/cw-a-input-text';

interface CWMSearchBoxProps extends CWAInputTextProps {
  inputClassName?: string;
}

const CWMSearchBox = function (props: CWMSearchBoxProps) {
  return (
    <div className={`form-input flex justify-between !p-0 ${props.className ?? ''}`}>
      <CWAInputText
        {...props}
        className={`!border-none focus:form-input ${props.inputClassName ?? ''}`}
      />
      <div className="flex items-center justify-center px-2 hover:cursor-pointer">
        <IconSearch />
      </div>
    </div>
  );
};

export default CWMSearchBox;
