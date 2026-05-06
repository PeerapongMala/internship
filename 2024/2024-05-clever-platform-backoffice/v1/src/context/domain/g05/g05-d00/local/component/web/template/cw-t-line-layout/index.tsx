import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';
import Header from '../../molecule/cw-m-header';
import Footer from '@core/design-system/library/vristo/source/components/Layouts/Footer';

type LineLayout = HTMLAttributes<HTMLDivElement> & {
  headerTitle: string;
  header?: boolean;
  footer?: boolean;
};
const ScreenTemplate = ({
  headerTitle,
  className,
  children,
  header = true,
  footer = true,
  ...props
}: LineLayout) => {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center px-5 pt-5 font-noto-sans-thai"
      {...props}
    >
      {header && <Header title={headerTitle} disableCloseButton />}

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

export default ScreenTemplate;
