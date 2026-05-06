import styles from './index.module.css';

export default function Button({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      className={`btn ${styles['btn']} ${className ? className : ''} `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
