import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { HTMLAttributes } from 'react';

type OverlayCameraScannerProps = HTMLAttributes<SVGElement> & {};

const OverlayCameraScanner = ({ className }: OverlayCameraScannerProps) => {
  return (
    <svg
      className={cn(
        'absolute inset-0 aspect-square h-[8pvw] max-h-[300px] w-[80vw] max-w-[300px]',
        className,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Top-left corner */}
      <line x1="0" y1="10" x2="0" y2="0" stroke="white" strokeWidth="4" />
      <line x1="0" y1="0" x2="10" y2="0" stroke="white" strokeWidth="4" />

      {/* Top-right corner */}
      <line x1="90" y1="0" x2="100" y2="0" stroke="white" strokeWidth="4" />
      <line x1="100" y1="0" x2="100" y2="10" stroke="white" strokeWidth="4" />

      {/* Bottom-left corner */}
      <line x1="0" y1="90" x2="0" y2="100" stroke="white" strokeWidth="4" />
      <line x1="0" y1="100" x2="10" y2="100" stroke="white" strokeWidth="4" />

      {/* Bottom-right corner */}
      <line x1="90" y1="100" x2="100" y2="100" stroke="white" strokeWidth="4" />
      <line x1="100" y1="90" x2="100" y2="100" stroke="white" strokeWidth="4" />
    </svg>
  );
};

export default OverlayCameraScanner;
