import { CSSProperties } from 'react';

import HighlightSVG from '../../../assets/btn-top-hightlight.svg';
import { Icon } from './wc-a-icon';

interface IButtonProps {
  children: string | string[];
  icon: string;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  seperatorStyle?: CSSProperties;
  onClick?: () => void;
}

export function ButtonWithIcon({
  children,
  icon,
  iconPosition = 'right',
  className = '',
  style = {},
  seperatorStyle = {},
  onClick,
}: IButtonProps) {
  return (
    <div
      className={
        'relative bg-[#1762f3] text-white text-xl font-bold w-fit h-fit rounded-full cursor-pointer border-box select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] ' +
        className
      }
      style={{
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #6F86F6',
        ...style,
      }}
      onClick={onClick}
    >
      <img
        src={HighlightSVG}
        className="absolute top-0 left-0 h-full w-auto select-none pointer-events-none"
      />
      <div className="flex justify-between items-center gap-2">
        {iconPosition === 'left' && icon && (
          <div
            className="border-r-2 border-solid border-[#6f86f6] py-3 px-6 pr-5"
            style={seperatorStyle}
          >
            <Icon src={icon} className="h-[40px] w-auto" />
          </div>
        )}
        <span
          className="flex-1 flex justify-center items-center"
          style={{
            textShadow:
              '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          {children}
        </span>
        {iconPosition === 'right' && icon && (
          <div
            className="border-l-2 border-solid border-[#6f86f6] py-3 px-6 pl-5"
            style={seperatorStyle}
          >
            <Icon src={icon} className="h-[40px] w-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ButtonWithIcon;
