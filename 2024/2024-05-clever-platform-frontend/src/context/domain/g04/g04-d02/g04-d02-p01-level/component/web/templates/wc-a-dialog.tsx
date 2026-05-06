interface DialogProps {
  className?: string;
  children: React.ReactNode;
}

export function Dialog({ children, className = '' }: DialogProps) {
  return (
    <div
      id="dialog"
      className={`flex flex-col rounded-[16px] border-0  w-[150px] h-[150px] mx-auto my-auto drop-shodow-lg overflow-hidden ${className}`}
      style={
        {
          // boxShadow:
          //   '0px 4px 8px 0px rgba(0, 0, 0, 0.30), 0px 8px 32px 0px rgba(0, 0, 0, 0.15)',
        }
      }
    >
      {children}
    </div>
  );
}

export default Dialog;
