import { CSSProperties, forwardRef } from 'react';

import { cn } from '@global/helper/cn';
import HighlightSVG from '../../../../assets/btn-top-hightlight.svg';
import { Icon } from '../wc-a-icon';

interface IButtonProps {
  children: string | string[];
  icon: string;
  iconPosition?: 'left' | 'right';
  iconClassName?: string;
  className?: string;
  textClassName?: string;
  style?: CSSProperties;
  seperatorStyle?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  variant?: keyof typeof VARIANT_CLASSES;
}

const VARIANT_CLASSES = {
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

export const ButtonWithIcon = forwardRef<HTMLDivElement, IButtonProps>(
  function ButtonWithIcon(
    {
      children,
      icon,
      iconPosition = 'right',
      iconClassName = '',
      className = '',
      textClassName = '',
      style = {},
      seperatorStyle = {},
      onClick,
      disabled = false,
      variant = 'primary',
    }: IButtonProps,
    ref,
  ) {
    return (
      <div
        className={cn(
          'relative text-xl font-bold w-fit h-fit rounded-full cursor-pointer select-none',
          'transition active:translate-y-0.5 hover:translate-y-[-0.125rem]',
          VARIANT_CLASSES[variant].body,
          'border-box border-b-4 border-solid',
          VARIANT_CLASSES[variant].border,
          className,
          disabled && 'brightness-75 pointer-events-none',
        )}
        style={{
          boxShadow:
            '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
          ...style,
        }}
        onClick={() => {
          if (!disabled && onClick) onClick();
        }}
        ref={ref}
      >
        <img
          src={HighlightSVG}
          className="absolute top-0 left-0 h-full w-auto select-none pointer-events-none"
        />
        <div className="flex justify-between items-center gap-2">
          {iconPosition === 'left' && icon && (
            <div
              className={cn(
                'border-r-2 border-solid py-3 pl-6 pr-4',
                VARIANT_CLASSES[variant].border,
              )}
              style={seperatorStyle}
            >
              <Icon src={icon} className={cn('h-[40px] w-auto', iconClassName)} />
            </div>
          )}
          <span
            className={cn(
              'flex-1 flex justify-center items-center',
              iconPosition === 'left' ? 'pr-4 pl-2' : 'pl-4 pr-2',
              textClassName,
            )}
            style={{
              textShadow:
                '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            {children}
          </span>
          {iconPosition === 'right' && icon && (
            <div
              className={cn(
                'border-l-2 border-solid py-3 pr-6 pl-4',
                VARIANT_CLASSES[variant].border,
              )}
              style={seperatorStyle}
            >
              <Icon src={icon} className={cn('h-[40px] w-auto', iconClassName)} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default ButtonWithIcon;
