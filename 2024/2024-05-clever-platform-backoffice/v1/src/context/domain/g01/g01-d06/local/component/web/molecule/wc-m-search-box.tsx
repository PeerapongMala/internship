import IconMagnifer from '../atom/wc-a-icon-magnify';
import Select from '../atom/wc-a-select';
import InputText, { InputTextProps } from '../atom/wc-a-text-input';

interface SearchBoxProps extends InputTextProps {
  inputClassName?: string;
}

const SearchBox = function (props: SearchBoxProps) {
  return (
    <div className={`form-input flex justify-between !p-0 ${props.className ?? ''}`}>
      <InputText
        {...props}
        className={`!border-none focus:form-input ${props.inputClassName ?? ''}`}
      />
      <div className="flex items-center justify-center px-2">
        <IconMagnifer />
      </div>
    </div>
  );
};

export default SearchBox;
