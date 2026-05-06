import TextWithStroke from '@global/component/web/atom/wc-a-text-stroke';
import HighlightSVG from '../../../../assets/btn-top-hightlight.svg';

export interface IButtonProps {
  prefix?: React.ReactNode;
  children?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large' | 'circle';
  width?: string;
  height?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'white'
    | 'ghost';
  style?: React.CSSProperties;
  textClassName?: string;
  disabled?: boolean;
}

const sizeClasses = {
  small: 'w-[100px] h-[40px]',
  medium: 'w-[200px] h-[60px]',
  large: 'w-[340px] h-[76px]',
  circle: 'w-[80px] h-[80px]',
};

const variantClasses = {
  primary: {
    body: 'bg-primary text-white',
    divider: 'divide-primary-border',
    'border-stroke': 'border-primary-stroke',
    border: 'border-primary-border',
    stroke: 'text-stroke-primary',
  },
  secondary: {
    body: 'bg-secondary text-black',
    divider: 'divide-secondary-stroke',
    'border-stroke': 'border-secondary-stroke',
    border: 'border-secondary-border',
    stroke: 'text-stroke-secondary',
  },
  tertiary: {
    body: 'bg-tertiary text-white',
    divider: 'divide-tertiary-border',
    'border-stroke': 'border-tertiary-stroke',
    border: 'border-tertiary-border',
    stroke: 'text-stroke-tertiary',
  },
  success: {
    body: 'bg-success text-white',
    divider: 'divide-success-border',
    'border-stroke': 'border-success-border',
    border: 'border-success-border',
    stroke: 'text-stroke-success',
  },
  warning: {
    body: 'bg-warning text-white',
    divider: 'divide-warning-border',
    'border-stroke': 'border-warning-stroke',
    border: 'border-warning-border',
    stroke: 'text-stroke-warning',
  },
  danger: {
    body: 'bg-danger text-white',
    divider: 'divide-danger-border',
    'border-stroke': 'border-danger-stroke',
    border: 'border-danger-border',
    stroke: 'text-stroke-danger',
  },
  white: {
    body: 'bg-white text-black',
    divider: 'divide-white-border',
    'border-stroke': 'border-white-stroke',
    border: 'border-white-border',
    stroke: 'text-stroke-white',
  },
  ghost: {
    body: 'bg-ghost/80 text-black',
    divider: '',
    'border-stroke': 'border-ghost-stroke',
    border: 'border-ghost-border',
    stroke: 'text-stroke-danger',
  },
};

const Button = ({
  prefix,
  children,
  suffix,
  className = '',
  onClick,
  size = 'medium',
  width,
  height,
  variant = 'primary',
  style,
  textClassName,
  disabled = false,
}: IButtonProps) => {
  return (
    <div
      className={`relative flex text-xl font-bold rounded-full cursor-pointer border-box border-b-4 select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
        ${variantClasses[variant].border}
        ${variantClasses[variant].body}
        ${prefix ? `divide-x-2 ${variantClasses[variant].divider}` : ''}
        ${sizeClasses[size]}
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        width,
        height,
        ...style,
      }}
      onClick={onClick}
    >
      <img src={HighlightSVG} className="absolute top-0 left-0 h-full w-auto" />
      {prefix && (
        <span className="flex py-3 px-3 justify-center items-center">{prefix}</span>
      )}
      <div
        style={{
          textShadow: '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
        }}
        className="flex items-center justify-center h-full w-full"
      >
        {typeof children === 'string' ? (
          <TextWithStroke
            text={children}
            className={`flex w-full h-full text-3xl ${textClassName ? textClassName : 'justify-center items-center'}`}
            strokeClassName={variantClasses[variant].stroke as any}
          />
        ) : (
          children
        )}
      </div>
      {suffix && (
        <span
          className={`py-3 px-3 border-l-2 ${variantClasses[variant]['border-stroke']}`}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

export default Button;
