import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

type ActionButtonProps = HTMLAttributes<HTMLButtonElement> & {
  icon: React.ReactNode;
};

const ButtonIcon = ({ className, icon, ...props }: ActionButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        'h-9 w-9 rounded-full bg-neutral-200 p-2 transition-colors hover:bg-neutral-300',
        className,
      )}
    >
      {icon}
    </button>
  );
};
export default ButtonIcon;
