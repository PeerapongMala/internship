import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const CWAButton = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        // Default styles
        'flex items-center justify-center',
        'h-[35px] w-[280px]',
        'border border-[#D4D4D4]',
        'bg-white',
        'gap-1 p-2',
        'rounded-[4px]',
        // Optional typography or additional defaults
        'text-h6 font-noto-sans-thai text-sm font-normal',
        // Merge in any custom classes
        className,
      )}
    >
      {label}
    </button>
  );
};

export default CWAButton;
