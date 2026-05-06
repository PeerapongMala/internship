import ImageIconMisc from '../../../assets/icon-misc.svg';

interface ButtonMiscProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  value?: string;
  id?: string;
}

const ButtonMisc = ({ onClick, className, disabled, value, id }: ButtonMiscProps) => {
  return (
    <div
      id={id}
      className={`relative bg-secondary p-1 rounded-full cursor-pointer border-box h-14 w-24 select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
      onClick={onClick}
    >
      <div className="flex justify-center items-center bg-white h-full w-full rounded-[30px] text-center px-1">
        {value ? (
          <div className="w-full h-full flex justify-center items-center font-medium">{value}</div>
        ) : (
          <img src={ImageIconMisc} alt="sound-on" className="h-11" />
        )}
      </div>
    </div>
  );
};

export default ButtonMisc;
