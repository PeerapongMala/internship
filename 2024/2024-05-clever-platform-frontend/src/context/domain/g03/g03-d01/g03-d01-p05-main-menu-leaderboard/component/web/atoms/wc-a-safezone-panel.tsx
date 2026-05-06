export function SafezonePanel({
  children,
  className = '',
  debug = false,
}: {
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
}) {
  // const multipleScale = 2.25;
  // 640 * 360 : 16:9 > 1440 * 810 > x2.25
  // 640 * 360 : 16:9 > 1280 * 720 > x2
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
      style={safezoneStyle}
      className={className + (debug ? ' border-4 border-red-500 border-dashed' : '')}
    >
      {children}
    </div>
  );
}

export default SafezonePanel;
