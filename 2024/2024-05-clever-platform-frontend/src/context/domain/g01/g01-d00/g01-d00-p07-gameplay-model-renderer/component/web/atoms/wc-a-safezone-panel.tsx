interface SafezonePanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
}

export function SafezonePanel({
  children,
  className = '',
  style = {},
  debug = false,
}: SafezonePanelProps) {
  const safezoneStyle: React.CSSProperties = {
    width: `1280px`,
    height: `720px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };
  return (
    <div
      style={{ ...safezoneStyle, ...style }}
      className={className + (debug ? ' border-4 border-red-500 border-dashed' : '')}
    >
      {children}
    </div>
  );
}

export default SafezonePanel;
