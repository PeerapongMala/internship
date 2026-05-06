import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';
import MenuFooter from '../../organism/cw-o-menu-footer';

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const ButtonText = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        'text-h6 w-[111px] rounded-[100px] bg-primary px-[14px] py-2 font-noto-sans-thai text-sm font-normal text-white',
        className,
      )}
    >
      {label}
    </button>
  );
};

export default ButtonText;
