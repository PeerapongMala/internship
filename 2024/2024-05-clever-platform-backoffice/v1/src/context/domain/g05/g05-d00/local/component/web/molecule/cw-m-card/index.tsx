import { HTMLAttributes } from 'react';
import Header from '../cw-m-header';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};
const Card = ({ title, className, children, ...props }: CardProps) => {
  return (
    <div className="w-full rounded-md bg-white p-[10px] shadow-md">
      {title && <Header title={title} disableCloseButton />}
      <div {...props} className={cn('flex w-full flex-col gap-2', className)}>
        {children}
      </div>
    </div>
  );
};

export default Card;
