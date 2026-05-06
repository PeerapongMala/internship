import TextWithStroke from '@global/component/web/atom/wc-a-text-stroke';
import { createSoundController, SoundKey, SoundVolume } from '@global/helper/sound';
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
  | 'ghost'
  | 'yellow'
  | 'gold'
  style?: React.CSSProperties;
  textClassName?: string;
  disabled?: boolean;
  strokeColor?: string;
  strokeSize?: string;
  soundKey?: SoundKey; // Use SoundKey type from sound helper
  soundVolume?: SoundVolume; // Optional volume control
  id?: string;
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
  yellow: {
    body: 'bg-[#FCD504] text-black',
    divider: 'divide-[#FFEE99]',
    'border-stroke': 'border-ghost-stroke',
    border: 'border border-[#FFEE99]',
    stroke: 'text-[#FCD504] ',
  },
  gold: {
    body: 'bg-[#FFCC00] text-black',
    divider: 'divide-[#FFE680]',
    'border-stroke': 'border-ghost-stroke',
    border: 'border border-[#FFE680]',
    stroke: 'text-[#FFCC00]',
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
  strokeColor,
  strokeSize,
  soundKey = 'game_hit',
  soundVolume = 'sfx',
  id,
}: IButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      try {
        const soundController = createSoundController(soundKey, {
          autoplay: true,
          loop: false,
          volume: soundVolume,
        });
      } catch (error) {
        console.error('Error playing button sound:', error);
      }

      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <div
      id={id}
      className={`relative flex text-xl font-bold rounded-full cursor-pointer border-box border-b-4 select-none transition transform
        active:scale-[0.9] hover:scale-[1.1]
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
      onClick={handleClick}
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
            strokeColor={strokeColor}
            strokeSize={strokeSize}
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
