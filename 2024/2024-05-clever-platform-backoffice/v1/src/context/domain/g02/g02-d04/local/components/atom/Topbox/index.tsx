import { cn } from '@core/design-system/library/vristo/source/utils/cn';

const Topbox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'mt-5 flex w-full flex-col rounded-md bg-gray-100 px-2 py-3 shadow-md',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Topbox;
