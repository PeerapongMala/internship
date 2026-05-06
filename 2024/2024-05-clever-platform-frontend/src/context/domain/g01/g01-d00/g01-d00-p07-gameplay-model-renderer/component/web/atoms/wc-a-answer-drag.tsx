import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import Latex from 'react-latex-next';

interface IButtonProps {
  id?: string;
  choice?: string;
  answer: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  onCanceled?: () => void;
}

const AnswerText = ({
  id,
  choice,
  answer,
  className = '',
  onClick,
  disabled,
  onCanceled,
}: IButtonProps) => {
  return (
    <div
      id={id}
      className={`relative bg-secondary p-1 rounded-[37px] cursor-pointer border-box h-[4rem] w-full select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
          ${className}
          ${disabled ? 'brightness-75 pointer-events-none' : ''}
          `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
        touchAction: 'none',
      }}
      onClick={onClick}
    >
      <div className="flex justify-center items-center bg-white h-full w-full rounded-[30px] text-center px-7 font-medium">
        {choice && (
          <div className="h-full">
            <div className="flex w-14 h-full justify-center items-center border-r-[2px] border-secondary">
              {choice}
            </div>
          </div>
        )}
        <div className="w-full h-full flex justify-center items-center">
          <Latex>{answer}</Latex>
        </div>
        {onCanceled && (
          <img
            className="absolute h-6 cursor-pointer px-2 top-[-7%] right-[-4%]"
            src={ImageCancelCircle}
            onClick={onCanceled}
          />
        )}
      </div>
    </div>
  );
};

export default AnswerText;
