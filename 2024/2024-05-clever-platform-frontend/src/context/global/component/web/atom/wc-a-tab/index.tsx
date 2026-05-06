export function Tab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className={
        'flex-1 py-2 text-center cursor-pointer transition-all duration-100 shadow-[0_2px_#fcd401] ' +
        (isActive ? 'shadow-[0_5px_#fcd401]' : '')
      }
      onClick={onClick}
    >
      <span
        className={`text-2xl transition-all duration-100 ${isActive ? 'opacity-100' : 'opacity-50'}`}
        style={{
          fontFamily: 'Noto Sans Thai, sans-serif',
          fontWeight: 700,
          color: '#333333',
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default Tab;
