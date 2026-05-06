import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes, ReactNode } from 'react';
import Footer from '@core/design-system/library/vristo/source/components/Layouts/Footer';
import Header from '@domain/g05/g05-d02/local/component/web/molecule/cw-m-header';

interface ScreenTemplateProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
  header?: boolean;
  footer?: boolean;
}

const ScreenTemplateWithoutHeader = ({
  className,
  children,
  header = true,
  footer = true,
  ...props
}: ScreenTemplateProps) => {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center px-5 pt-5 font-noto-sans-thai"
      {...props}
    >
      {header}

      <main className={cn('flex w-full flex-grow flex-col gap-5', className)}>
        {children}
      </main>
      {footer && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default ScreenTemplateWithoutHeader;
