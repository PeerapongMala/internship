import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { FC } from 'react';

const WCAIconChevronsLeft: FC = ({ className }: { className?: string }) => {
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
      className={cn('feather feather-chevrons-left', className)}
    >
      <polyline points="11 17 6 12 11 7"></polyline>
      <polyline points="18 17 13 12 18 7"></polyline>
    </svg>
  );
};

export default WCAIconChevronsLeft;
