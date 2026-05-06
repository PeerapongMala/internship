interface IconProps {
  src: string;
  className?: string;
  onClick?: () => void;
}

export function IconSmall({ src, onClick, className = '' }: IconProps) {
  return <img src={src} onClick={onClick} className={`w-[24px] h-[24px] ${className}`} />;
}

export function Icon({ src, onClick, className = '' }: IconProps) {
  return <img src={src} onClick={onClick} className={`w-[32px] h-[32px] ${className}`} />;
}

export default { IconSmall, Icon };
