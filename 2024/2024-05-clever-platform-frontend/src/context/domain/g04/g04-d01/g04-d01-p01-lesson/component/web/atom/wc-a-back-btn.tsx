import HighlightSVG from '../../../assets/btn-top-hightlight.svg';
import BackIcon from '../../../assets/button-backicon.svg';

interface ButtonBackProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export function ButtonBack({ onClick, children }: ButtonBackProps) {
  return (
    <div
      className="relative bg-[#ff6b00] text-white text-xl font-bold py-2 px-2 w-[64px] h-[64px] rounded-full cursor-pointer"
      style={{
        boxShadow:
          '0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05), inset 0 -4px 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '4px solid #ffc499',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <img
        src={HighlightSVG}
        className="absolute inset-0 m-auto h-full w-full object-cover"
        alt="Highlight SVG"
        style={{ zIndex: 1 }}
      />
      <img
        src={BackIcon}
        alt="Back Icon"
        className="absolute inset-0 m-auto h-3/4 w-3/4"
        style={{ zIndex: 2 }}
      />
      {children}
    </div>
  );
}

export default ButtonBack;
