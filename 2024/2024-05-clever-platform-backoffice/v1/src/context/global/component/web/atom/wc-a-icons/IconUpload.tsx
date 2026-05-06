import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { FC } from 'react';

interface IconUploadProps {
  className?: string;
  fill?: boolean;
  duotone?: boolean;
  width?: string | number;
  height?: string | number;
}

const WCAIconUpload: FC<IconUploadProps> = ({
  className,
  fill = false,
  duotone = true,
  height = '24',
  width = '24',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('feather feather-upload', className)}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );
};

export default WCAIconUpload;
