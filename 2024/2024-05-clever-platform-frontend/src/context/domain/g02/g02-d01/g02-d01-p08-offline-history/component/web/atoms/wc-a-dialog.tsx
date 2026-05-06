import styles from '../../../style.module.css';
export function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="dialog"
      className={`flex flex-col gap-4 bg-white bg-opacity-80 rounded-[64px] mx-auto my-auto w-3/5 h-3/5 p-4 box-border ${styles['font-noto-sans-thai']}`}
      style={{
        boxShadow: '0px 8px 0px 0px #DFDEDE, 0px 16px 8px 0px rgba(0, 0, 0, 0.15)',
      }}
    >
      {children}
    </div>
  );
}

export default Dialog;
