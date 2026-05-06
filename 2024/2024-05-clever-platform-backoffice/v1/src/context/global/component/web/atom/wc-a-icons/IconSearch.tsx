import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { FC } from 'react';

interface IconSearchProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
}

const WCAIconSearch: FC<IconSearchProps> = ({
  className,
  fill = false,
  duotone = true,
}) => {
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
      className={cn('feather feather-search', className)}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
};

export default WCAIconSearch;
