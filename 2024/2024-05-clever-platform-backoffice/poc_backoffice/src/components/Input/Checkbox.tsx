import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    label?: React.ReactNode;
    placeholder?: string;
    value?: string | number;
    className?: string;
}

const InputCheckbox = ({
    onChange,
    required,
    label = '',
    placeholder,
    value,
    className = '',
    ...rest
}: InputProps) => {
    return (
        <div className={'flex items-center ' + className}>
            <label className="inline-flex items-center w-fit gap-1">
                <input type="checkbox" className="form-checkbox" required={required} onChange={onChange} placeholder={placeholder} value={value} {...rest} />
                <div className="">{label}</div>
            </label>
        </div>
    );
};

export default InputCheckbox;
