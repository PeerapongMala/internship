interface TextAtomicProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TextHeader({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-3xl font-bold ${className}`}>{children}</span>
  );
}

export function TextSubheader({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-2xl font-bold ${className}`} style={style}>
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

export function TextMuted({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-xl tracking-tight	 ${className}`} style={style}>
      {children}
    </span>
  );
}
