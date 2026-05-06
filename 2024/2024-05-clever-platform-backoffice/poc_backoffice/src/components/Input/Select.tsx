import Select, { ActionMeta, MultiValue, Props, SingleValue } from 'react-select';

interface Option {
    value: any;
    label: string;
}

interface InputSelectProps extends Props<Option> {
    onChange?: (newValue: SingleValue<Option> | MultiValue<Option> | any, actionMeta: ActionMeta<Option>) => void;
    required?: boolean;
    disabled?: boolean;
    label?: React.ReactNode;
    className?: string;
}

const InputSelect = ({
    onChange,
    required,
    disabled,
    label,
    className = '',
    ...rest
}: InputSelectProps) => {
    return (
        <div className={className}>
            {/* if label is string */}
            {typeof label === 'string' && (
                <div className='text-base my-2'>
                    {required && <span className='text-red-500'>*</span>}
                    {label}:
                </div>
            )}

            {/* if label is react node */}
            {label && typeof label !== 'string' && (
                <div className='flex my-2'>
                    {required && <span className='text-red-500'>*</span>}
                    {label}
                </div>
            )}
            <Select
                onChange={(newValue, actionMeta) => onChange && onChange(newValue, actionMeta)}
                isDisabled={disabled}
                {...rest}
            />
        </div>
    );
};

export default InputSelect;
