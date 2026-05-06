import { ReactNode, useState } from 'react';
import CWAccordionBox from '../../atom/cw-a-accordion-box';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

export type TAccordionList = {
  className?: string;
  title?: ReactNode;
  render?: ReactNode;
  hideToggleOpenButton?: boolean;
};

type AccordionManagerProps = {
  className?: string;
  accordionLists: TAccordionList[];
};

const CWAccordionManager = ({ className, accordionLists }: AccordionManagerProps) => {
  const [openIndex, setOpenIndex] = useState<number | undefined>();

  return (
    <div className={cn('flex w-full flex-col gap-5', className)}>
      {accordionLists.map((item, i) => (
        <CWAccordionBox
          key={`accordion-box-${i}`}
          hideToggleOpenButton={item.hideToggleOpenButton}
          className={item.className}
          isOpen={openIndex === i}
          title={item.title}
          onToggleOpen={(isOpen) => (isOpen ? setOpenIndex(i) : setOpenIndex(undefined))}
        >
          {item.render}
        </CWAccordionBox>
      ))}
    </div>
  );
};

export default CWAccordionManager;
