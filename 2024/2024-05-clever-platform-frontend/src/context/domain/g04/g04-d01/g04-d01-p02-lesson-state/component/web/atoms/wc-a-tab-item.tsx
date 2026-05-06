import { TextNormal } from './wc-a-text';

interface TabProps {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function TabItem({
  children,
  onClick,
  isActive = false,
  className = '',
}: TabProps) {
  return (
    <div
      className={`flex-1 flex items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div
        className="flex items-center justify-center w-full h-full my-2 py-4"
        style={{
          borderBottom: isActive ? '5px solid #FCD401' : 'none',
        }}
      >
        <TextNormal
          style={{
            opacity: isActive ? 1 : 0.5,
          }}
        >
          {children}
        </TextNormal>
      </div>
    </div>
  );
}

export default TabItem;
