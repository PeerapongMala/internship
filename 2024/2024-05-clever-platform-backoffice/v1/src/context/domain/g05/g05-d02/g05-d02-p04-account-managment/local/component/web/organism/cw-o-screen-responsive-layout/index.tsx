import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

export type ResponsiveLayoutProps = HTMLAttributes<HTMLDivElement>;

const ResponsiveLayout = ({ children, className, ...props }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen w-full" {...props}>
      <div className={cn(`mx-auto w-full transition-all duration-200`, className)}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
