import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { FC } from 'react';

const WCAIconChevronRight: FC = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('feather feather-chevron-right', className)}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

export default WCAIconChevronRight;
