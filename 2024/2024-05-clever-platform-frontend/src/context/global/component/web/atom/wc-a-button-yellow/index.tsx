import HighlightSVG from '../../../../assets/btn-top-hightlight.svg';

interface IButtonProps {
  prefix?: React.ReactNode;
  children: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button = ({ prefix, children, suffix, className = '', onClick }: IButtonProps) => {
  return (
    <div
      className={`relative flex bg-secondary text-black text-xl font-bold  w-fit h-fit rounded-full cursor-pointer border-box
        ${className} ${prefix ? 'divide-x-2 divide-[#EEC800]' : ''}`}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #F2E18F',
      }}
      onClick={onClick}
    >
      <img src={HighlightSVG} className="absolute top-0 left-0 h-full w-auto" />
      {prefix && <span className="py-3 px-3">{prefix}</span>}
      <div
        style={{
          textShadow: '0px 4px 4px rgba(0, 0, 0, 0.15), 0px 8px 8px rgba(0, 0, 0, 0.05)',
        }}
        className="py-3 px-3"
      >
        {children}
      </div>
      {suffix && <span className="py-3 px-3 border-l-2 border-[#F2E18F]">{suffix}</span>}
    </div>
  );
};

export default Button;
