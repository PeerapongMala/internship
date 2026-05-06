import styles from '../../../style.module.css';

interface TextAtomicUIProps {
  children: string;
  className?: string;
}

export function TextTitle({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-3xl ${styles['text-title']} ${className}`}>{children}</span>
  );
}

export function TextTab({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-2xl text-red-300 ${styles['text-tab']} ${className}`}>
      {children}
    </span>
  );
}

export function TextSubtitle({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-xl ${styles['text-subtitle']} ${className}`}>{children}</span>
  );
}

export function TextAccountName({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-lg ${styles['text-account-name']} ${className}`}>
      {children}
    </span>
  );
}

export function TextAccountDate({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-md ${styles['text-account-date']} ${className}`}>
      {children}
    </span>
  );
}

export function TextDeviceID({ children, className = '' }: TextAtomicUIProps) {
  return (
    <span className={`text-md ${styles['text-device-id']} ${className}`}>{children}</span>
  );
}
