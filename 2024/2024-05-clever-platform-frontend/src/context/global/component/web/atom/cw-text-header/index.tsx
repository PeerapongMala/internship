interface TextAtomicProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CWTextHeader({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-3xl font-bold ${className}`}>{children}</span>
  );
}

export function CWTextSubheader({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-2xl font-bold ${className}`} style={style}>
      {children}
    </span>
  );
}

export function CWTextNormal({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-xl font-bold ${className}`} style={style}>
      {children}
    </span>
  );
}

export function CWTextMuted({ children, className = '', style = {} }: TextAtomicProps) {
  return (
    <span className={`text-gray-20 text-xl tracking-tight	 ${className}`} style={style}>
      {children}
    </span>
  );
}
