import Select, {
  ActionMeta,
  MultiValue,
  Props,
  SingleValue,
  StylesConfig,
} from 'react-select';

interface Option {
  value: any;
  label: string;
}

interface InputSelectProps extends Props<Option> {
  onChange?: (
    newValue: SingleValue<Option> | MultiValue<Option> | any,
    actionMeta: ActionMeta<Option>,
  ) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
  styles?: StylesConfig<Option, boolean>;
}

const InputSelect = ({
  onChange,
  required,
  disabled,
  label,
  className = '',
  styles,
  options = [],
  ...rest
}: InputSelectProps) => {
  const selectOptions = [{ value: '', label: `Select...` }, ...options];
  return (
    <div className={className}>
      {/* if label is string */}
      {typeof label === 'string' && (
        <div className="my-2 text-base">
          {required && <span className="text-red-500">* </span>}
          {label}:
        </div>
      )}

      {/* if label is react node */}
      {label && typeof label !== 'string' && (
        <div className="my-2 flex">
          {required && <span className="text-red-500">* </span>}
          {label}
        </div>
      )}
      <Select
        onChange={(newValue, actionMeta) => onChange && onChange(newValue, actionMeta)}
        isDisabled={disabled}
        required={required}
        styles={styles}
        options={selectOptions}
        {...rest}
      />
    </div>
  );
};

export default InputSelect;
