import { CSSProperties } from 'react';

import Button, { IButtonProps } from '@global/component/web/atom/wc-a-button';

interface IconButtonWithNotificationProps
  extends Pick<IButtonProps, 'variant' | 'disabled'> {
  iconSrc: string;
  notification?: boolean | number;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  buttonStyle?: CSSProperties;
  onClick?: () => void;
}

export function IconButtonWithNotification({
  iconSrc,
  notification,
  onClick,
  variant = 'primary',
  width = 64,
  height = 64,
  className = '',
  style = {},
  buttonStyle = {},
  disabled = false,
}: IconButtonWithNotificationProps) {
  return (
    <div
      className={
        'relative rounded-full cursor-pointer border-box select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] ' +
        className
      }
      style={style}
    >
      <Button
        variant={variant}
        width={`${width}px`}
        height={`${height}px`}
        onClick={onClick}
        disabled={disabled}
        style={buttonStyle}
      >
        <img
          title="image"
          src={iconSrc}
          className="w-full h-auto p-4 select-none pointer-events-none"
        />
      </Button>
      {notification && (
        <div className="absolute top-[-0.25rem] right-[0.5rem] bg-secondary rounded-full p-1 w-[32px] h-[32px] text-center">
          {typeof notification === 'number' && (
            <span
              className="font-semibold"
              style={{ textShadow: '0px 1px 0px rgba(255, 255, 255, 0.60)' }}
            >
              {notification}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default IconButtonWithNotification;
