import { ReactNode } from 'react';

import HighlightSVG from '../../../assets/btn-top-hightlight.svg';

interface IButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Button({ children, className = '', onClick }: IButtonProps) {
  return (
    <div
      className={
        'relative bg-[#1762F3] text-white text-xl font-bold py-2 px-4 w-[64px] h-[64px] rounded-full cursor-pointer ' +
        className
      }
      style={{
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #6F86F6',
      }}
      onClick={onClick}
    >
      <img src={HighlightSVG} className="absolute top-0 left-0 h-full w-auto" />
      <span
        style={{
          textShadow: '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </span>
    </div>
  );
}
export default Button;
