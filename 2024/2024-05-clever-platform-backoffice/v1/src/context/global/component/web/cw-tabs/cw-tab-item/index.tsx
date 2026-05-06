import { ReactNode } from 'react';

interface TabItemProps {
  children?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export default function CWTabItem({ children, onClick, selected }: TabItemProps) {
  return (
    <button
      type="button"
      className={`text-[14px] md:text-[14px] ${selected ? 'border-b !border-[#4361EE] !text-[#4361EE] !outline-none' : ''} -mb-[1px] flex items-center border-transparent px-4 py-1.5 leading-5 text-neutral-500 before:inline-block hover:border-b hover:!border-[#4361EE] hover:text-[#4361EE] sm:px-5`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
