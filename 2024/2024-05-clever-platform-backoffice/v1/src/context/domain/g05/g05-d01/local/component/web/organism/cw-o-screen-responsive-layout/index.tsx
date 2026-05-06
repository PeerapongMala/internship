import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

export type ResponsiveLayoutProps = HTMLAttributes<HTMLDivElement>;

const ResponsiveLayout = ({ children, className, ...props }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen w-full" {...props}>
      <div
        className={cn(
          `mx-auto w-full px-5 transition-all duration-200 min-[360px]:w-[360px] min-[400px]:w-[400px] min-[500px]:w-[500px] min-[600px]:w-[600px] sm:px-3 min-[700px]:w-[700px] md:px-4 min-[800px]:w-[800px] min-[864px]:w-[864px] min-[900px]:w-[900px] min-[1000px]:w-[1000px] lg:px-6 min-[1100px]:w-[1100px] min-[1200px]:w-[1200px] xl:px-8 min-[1300px]:w-[1300px] min-[1400px]:w-[1400px] 2xl:px-10 min-[1536px]:w-[1536px] min-[1600px]:w-[1600px] min-[1700px]:w-[1700px] min-[1800px]:w-[1800px] min-[1946px]:w-[1946px]`,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsiveLayout;
