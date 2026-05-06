import { TextTab } from './wc-a-text';

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
        'flex-1 py-2 text-center cursor-pointer transition-all duration-100 ' +
        (isActive ? 'shadow-[0_4px_#fcd401]' : '')
      }
      onClick={onClick}
    >
      <TextTab>{label}</TextTab>
    </div>
  );
}

export default Tab;
