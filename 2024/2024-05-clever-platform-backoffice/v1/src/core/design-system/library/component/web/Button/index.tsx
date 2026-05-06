export interface IButtonProps {
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

  outline?: boolean;
}

const Button = ({
  className = '',
  onClick,
  variant = 'primary',
  disabled = false,
  title,
  icon,
  outline = false,
}: IButtonProps) => {
  const buttonClass = outline ? `btn-outline-${variant}` : `btn-${variant}`;
  return (
    <button
      className={`${className} btn flex gap-2 ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className="icon">{icon}</div>}
      {title}
    </button>
  );
};

export default Button;
