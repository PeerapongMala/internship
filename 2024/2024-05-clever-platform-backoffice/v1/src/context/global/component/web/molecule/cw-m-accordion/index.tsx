import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { useState, useEffect } from 'react';
import AnimateHeight from 'react-animate-height';

interface AccordionProps {
  title: React.ReactNode;
  time?: React.ReactNode;
  isCorrect?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onClick?: () => void;
  expandAll?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

// million-ignore
const CWMAccordion = ({
  title,
  children,
  isOpen = false,
  onClick,
  expandAll,
  className,
  time,
  isCorrect,
  headerClassName,
  bodyClassName,
}: AccordionProps) => {
  const [open, setOpen] = useState(isOpen);

  const handleToggle = () => {
    if (expandAll) return;
    if (onClick) onClick();
    else setOpen(!open);
  };

  useEffect(() => {
    if (expandAll !== undefined) setOpen(expandAll);
  }, [expandAll]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const hasExtraInfo = time !== undefined || isCorrect !== undefined;

  return (
    <div className={className}>
      <button
        className={cn(
          `flex w-full items-center rounded p-2`,
          headerClassName,
          open && !expandAll ? '!text-primary' : '',
          expandAll ? 'cursor-default' : 'cursor-pointer',
        )}
        onClick={handleToggle}
      >
        <IconCaretDown
          className={cn(
            `h-4 w-4 -rotate-90`,
            open ? 'rotate-0' : '',
            expandAll ? 'opacity-0' : '',
          )}
        />
        <div className="ml-2 flex w-full items-center justify-between">
          <div className="font-bold">{title}</div>
          {hasExtraInfo && (
            <div className="flex gap-2">
              {time && <div>{time}</div>}
              {isCorrect && <div>{isCorrect}</div>}
            </div>
          )}
        </div>
      </button>

      <AnimateHeight duration={300} height={open || expandAll ? 'auto' : 0}>
        <div className={cn(bodyClassName)}>{children}</div>
      </AnimateHeight>
    </div>
  );
};

export default CWMAccordion;
