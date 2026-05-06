import { ReactNode, useState, forwardRef } from 'react';
import { EyeIcon, EyeSlashIcon } from '../../../local/icon/icon';

type Props = {
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  type?: React.HTMLInputTypeAttribute;
  subLabel?: string;
  endContent?: ReactNode;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
};

const TextField = forwardRef<HTMLDivElement, Props>(
  (
    { endContent, label, required, subLabel, type, error, value, name, onChange, onBlur },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const getInputType = () => {
      if (type !== 'password') {
        return type;
      }
      return showPassword ? 'text' : 'password';
    };

    return (
      <div ref={ref} className="space-y-3 w-full scroll-mt-32">
       {' '}
        <div className="flex justify-between w-full">
          <p className="text-[16px] leading-4 text-[#344054] dark:text-[#D7D7D7]">
            {label}
            {required && <span className="text-[#D83636]">*</span>}
          </p>
          <p className="text-[16px] leading-4 text-[#262626] dark:text-[#D7D7D7]">
            {subLabel}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex w-full">
            <input
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`py-[12px] px-[16px] w-full bg-transparent border-[1px] rounded-lg 
              ${error ? 'border-red-500' : 'border-[#D0D5DD] dark:border-[#737373]'} 
              dark:text-white`}
              type={getInputType()}
            />
            {type !== 'password' ? (
              endContent
            ) : (
              <button
                type="button"
                className="ml-[-48px]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  },
);

export default TextField;
