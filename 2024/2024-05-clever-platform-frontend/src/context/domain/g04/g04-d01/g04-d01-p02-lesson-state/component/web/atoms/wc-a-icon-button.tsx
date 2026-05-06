import { CSSProperties } from 'react';

import Button, { IButtonProps } from '@global/component/web/atom/wc-a-button';
import styles from './wc-a-icon-button.module.css';

interface IconButtonProps extends Pick<IButtonProps, 'variant' | 'disabled'> {
  iconSrc: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  isLoading?: boolean;
  title?: string;
  'aria-label'?: string;
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
  isLoading = false,
  title,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  return (
    <div className="w-min h-min relative" title={title} aria-label={ariaLabel}>
      <div className={isLoading ? `${styles['icon-loading']}` : 'hidden'} />
      <Button
        variant={variant}
        width={`${width}px`}
        height={`${height}px`}
        className={`${className}`}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        <img
          title={title || "image"}
          src={iconSrc}
          className="w-full h-auto p-3 select-none pointer-events-none"
        />
      </Button>
    </div>
  );
}

export default IconButton;
