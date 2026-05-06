import { cn } from '@global/helper/cn';

interface SafezonePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
}

// Note: Added million-ignore to prevent optimization issues
//       that may cause destructuring props to be ignored.
// million-ignore
export function SafezonePanel({
  children,
  onClick,
  className = '',
  style = {},
  debug = false,
  ...props
}: SafezonePanelProps) {
  // const multipleScale = 2.25;
  // 640 * 360 : 16:9 > 1440 * 810 > x2.25
  // 640 * 360 : 16:9 > 1280 * 720 > x2
  const safezoneStyle: React.CSSProperties = {
    width: `1280px`,
    height: `720px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'visible',
  };
  return (
    <div
      style={{ ...safezoneStyle, ...style }}
      className={cn(className, debug && 'border-4 border-red-500 border-dashed')}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default SafezonePanel;
