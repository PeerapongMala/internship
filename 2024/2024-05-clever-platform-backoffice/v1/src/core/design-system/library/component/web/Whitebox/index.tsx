import { cn } from '@core/design-system/library/vristo/source/utils/cn';

const WhiteBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('w-full rounded-md bg-white p-5 shadow-md', className)}>
      {children}
    </div>
  );
};

export default WhiteBox;
