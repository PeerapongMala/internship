import { CSSProperties } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Container({
  children,
  className = '',
  style = {},
  onClick,
}: ContainerProps) {
  return (
    <div
      className={
        'flex items-center gap-2 px-2 rounded-3xl ' +
        (onClick ? ' cursor-pointer ' : ' ') +
        className
      }
      style={{
        border: '4px solid white',
        background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.80) 100%)',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Container;
