import HighlightSVG from '../../../assets/btn-top-hightlight.svg';
import { IconSmall } from './wc-a-icon';

interface IButtonProps {
  children: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

export function Button({ children, icon, className = '', onClick }: IButtonProps) {
  return (
    <div
      className={
        'relative bg-[#1762F3] text-white text-xl font-bold py-2 px-4 w-fit h-fit rounded-full cursor-pointer border-box select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] ' +
        className
      }
      style={{
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #6F86F6',
      }}
      onClick={onClick}
    >
      <img
        src={HighlightSVG}
        className="absolute top-0 left-0 h-full w-auto select-none pointer-events-none"
      />
      <p
        className="flex justify-center items-center gap-2"
        style={{
          textShadow: '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        {icon && <IconSmall src={icon} className="w-[24px] h-[24px]" />}
        {children}
      </p>
    </div>
  );
}

export default Button;
