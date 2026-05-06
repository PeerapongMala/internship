import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { ReactNode } from '@tanstack/react-router';
import AnimateHeight from 'react-animate-height';

type AccordionBoxProps = {
  hideToggleOpenButton?: boolean;
  className?: string;
  contentClassName?: string;
  isOpen: boolean;
  title?: ReactNode;
  children?: ReactNode;
  onToggleOpen?: (isOpen: boolean) => void;
};

const CWAccordionBox = ({
  hideToggleOpenButton,
  className,
  contentClassName,
  title,
  children,
  isOpen,
  onToggleOpen,
}: AccordionBoxProps) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-md border border-neutral-200 bg-white p-5',
        className,
      )}
    >
      <div className="flex gap-4">
        {!hideToggleOpenButton && (
          <button type="button" onClick={() => onToggleOpen?.(!isOpen)}>
            {isOpen ? <IconArrowDown /> : <IconArrowRight />}
          </button>
        )}

        <span className="w-full text-xl font-bold">{title}</span>
      </div>
      <AnimateHeight height={isOpen ? 'auto' : 0} duration={300}>
        <div className={cn('mt-5 flex flex-col overflow-x-scroll', contentClassName)}>
          {children}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default CWAccordionBox;
