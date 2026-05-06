import { CSSProperties } from 'react';

import Button, { IButtonProps } from '@global/component/web/atom/wc-a-button';

interface IconButtonProps extends Pick<IButtonProps, 'variant' | 'disabled'> {
  iconSrc: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function IconButton({
  iconSrc,
  onClick,
  variant = 'primary',
  width = 64,
  height = 64,
  className = '',
  style = {},
  disabled,
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      width={`${width}px`}
      height={`${height}px`}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      <img
        title="image"
        src={iconSrc}
        className="w-full h-auto p-4 select-none pointer-events-none"
      />
    </Button>
  );
}

export default IconButton;
