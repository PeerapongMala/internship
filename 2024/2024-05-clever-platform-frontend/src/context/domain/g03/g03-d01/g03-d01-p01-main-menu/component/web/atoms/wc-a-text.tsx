interface TextAtomicProps {
  children: string | string[] | number;
  className?: string;
  style?: React.CSSProperties;
}

export function TextHeader({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-3xl font-bold ${className}`} style={style}>
      {children}
    </span>
  );
}

export function TextNormal({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-xl font-bold ${className}`} style={style}>
      {children}
    </span>
  );
}

export function TextLight({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span
      className={`text-gray-20 text-lg font-normal tracking-tighter ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
