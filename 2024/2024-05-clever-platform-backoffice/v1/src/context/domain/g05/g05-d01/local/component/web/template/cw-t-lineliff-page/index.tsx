import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes, useEffect } from 'react';
import Footer from '@core/design-system/library/vristo/source/components/Layouts/Footer';
import StoreGlobal from '@store/global';

type LineLiffPageProps = HTMLAttributes<HTMLDivElement> & {
  footer?: boolean;
};

const LineLiffPage = ({
  className,
  children,
  footer = true,
  ...props
}: LineLiffPageProps) => {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center bg-white px-5 pt-5 font-noto-sans-thai"
      {...props}
    >
      <main className={cn('flex w-full flex-grow flex-col gap-5', className)}>
        {children}
      </main>

      {footer && <footer>{/* <Footer /> */}</footer>}
    </div>
  );
};

export default LineLiffPage;
