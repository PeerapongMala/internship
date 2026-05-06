import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick?: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'white'
    | 'dark';
  disabled?: boolean;
  title?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  loading?: boolean;
  outline?: boolean;
  clearable?: boolean;
  onClear?: (e: React.MouseEvent) => void;
  showClear?: boolean;
  parentClassname?: string;
}
//million-ignore
const CWButton = ({
  className = 'max-h-[45px]',
  onClick,
  variant = 'primary',
  disabled = false,
  title,
  icon,
  suffix,
  outline = false,
  loading,
  clearable = false,
  onClear,
  showClear = false,
  parentClassname,
  ...rest
}: IButtonProps) => {
  const buttonClass = outline ? `btn-outline-${variant}` : `btn-${variant}`;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.(e);
  };

  return (
    <div className={cn('relative block', parentClassname)}>
      <button
        className={cn(`btn flex w-full gap-2`, className, buttonClass)}
        onClick={onClick}
        disabled={disabled || loading}
        {...rest}
      >
        {loading && (
          <span
            className={cn(
              'animate-spin border-2',
              outline ? `border-${variant}` : 'border-white',
              'inline-block h-[18px] w-[18px] shrink-0 rounded-full border-l-transparent align-middle',
            )}
          />
        )}
        {icon && <div className="icon">{icon}</div>}
        {title}
        {suffix}
      </button>
      {clearable && showClear && !disabled && !loading && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
        >
          <IconX className="size-5 text-white hover:text-dark" />
        </button>
      )}
    </div>
  );
};

export default CWButton;
