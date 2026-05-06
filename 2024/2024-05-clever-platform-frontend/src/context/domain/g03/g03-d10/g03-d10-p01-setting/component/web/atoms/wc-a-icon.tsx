import styles from './wc-a-icon.module.css';
interface IconProps {
  src: string;
  className?: string;
}

export function Icon({ src, className = '' }: IconProps) {
  return <img src={src} className={`${styles['icon']} w-[32px] h-[32px] ${className}`} />;
}

export function IconSmall({ src, className = '' }: IconProps) {
  return <Icon src={src} className={`w-[24px] h-[24px] ${className}`} />;
}

export default { IconSmall, Icon };
