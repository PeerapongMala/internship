import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

import Footer from '@core/design-system/library/vristo/source/components/Layouts/Footer';
import Header from '@domain/g05/g05-d02/local/component/web/molecule/cw-m-header';

type LineLayout = HTMLAttributes<HTMLDivElement> & {
  headerTitle?: string;
  header?: boolean;
  footer?: boolean;
  bg_white?: boolean;
};
const ScreenTemplate = ({
  headerTitle,
  className,
  children,
  header = true,
  footer = true,
  bg_white = true,
  ...props
}: LineLayout) => {
  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-5 font-noto-sans-thai ${bg_white ? 'bg-white' : ''}`}
      {...props}
    >
      {header && <Header title={headerTitle ?? ''} />}
      <main className={cn('flex w-full flex-grow flex-col gap-5', className)}>
        {children}
      </main>

      {footer && <footer>{/* <Footer /> */}</footer>}
    </div>
  );
};

export default ScreenTemplate;
