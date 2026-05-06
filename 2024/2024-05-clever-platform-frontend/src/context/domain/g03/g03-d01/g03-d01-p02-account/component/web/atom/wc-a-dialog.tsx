export function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="dialog"
      className="flex flex-col gap-4 bg-white bg-opacity-80 rounded-[64px] border-8 border-white mx-auto my-auto w-4/5 h-4/5 drop-shodow-lg font-noto-sans-thai"
    >
      {children}
    </div>
  );
}

export default Dialog;
