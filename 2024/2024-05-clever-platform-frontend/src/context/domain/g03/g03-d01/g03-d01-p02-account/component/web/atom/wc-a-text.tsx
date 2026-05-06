interface ITextAtomicUI {
  children: string;
}

export function TextHeader({ children }: ITextAtomicUI) {
  return <span className="text-gray-20 text-3xl font-bold">{children}</span>;
}

export function TextMuted({ children }: ITextAtomicUI) {
  return <span className="text-gray-20 text-xl font-bold">{children}</span>;
}
