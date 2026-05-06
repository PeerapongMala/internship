import styles from '../../../index.module.css';

interface DialogProps {
  className?: string;
  children: React.ReactNode;
}

export function Dialog({ children, className = '' }: DialogProps) {
  return (
    <div
      id="dialog"
      className={`flex flex-col gap-4 bg-white bg-opacity-80 rounded-[64px] border-8 border-white mx-auto my-auto w-11/12 h-5/6 drop-shodow-lg overflow-hidden ${styles['font-noto-sans-thai']} ${className}`}
      style={{
        boxShadow:
          '0px 4px 8px 0px rgba(0, 0, 0, 0.30), 0px 8px 32px 0px rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
    </div>
  );
}

export default Dialog;
