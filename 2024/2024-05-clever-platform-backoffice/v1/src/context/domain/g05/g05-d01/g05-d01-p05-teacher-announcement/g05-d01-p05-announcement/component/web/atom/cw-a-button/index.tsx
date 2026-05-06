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
  ...rest
}: IButtonProps) => {
  const buttonClass = outline ? `btn-outline-${variant}` : `btn-${variant}`;
  return (
    <button
      className={`${className} btn flex w-full gap-2 ${buttonClass}`}
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
  );
};

export default CWButton;
