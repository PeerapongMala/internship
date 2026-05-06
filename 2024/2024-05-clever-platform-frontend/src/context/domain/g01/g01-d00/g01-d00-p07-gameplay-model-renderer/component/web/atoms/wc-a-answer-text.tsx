import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import React from 'react';
import Latex from 'react-latex-next';

interface IButtonProps {
  id?: string;
  choice?: string;
  answer: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  onCanceled?: () => void;
}

const AnswerText = ({
  id,
  choice,
  answer,
  className = '',
  onClick,
  disabled,
  selected,
  onCanceled,
}: IButtonProps) => {
  return (
    <div
      id={id}
      className={`relative bg-secondary p-1 rounded-[37px] cursor-pointer w-full  select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
          ${className}
          ${disabled ? 'brightness-75 pointer-events-none' : ''}
          h-full`}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
        touchAction: 'none',
      }}
      onClick={onClick}
    >
      <div
        className={`
          flex bg-white h-full w-full rounded-[30px] font-medium
          ${selected ? '!bg-secondary-stroke' : ''}
        `}
      >
        {choice && (
          <div className="flex-shrink-0 flex items-center justify-center w-14 border-r-[2px] border-secondary">
            {choice}
          </div>
        )}
        <div className="flex-grow flex items-center p-4">
          <div className="w-full text-center text-gray-800 leading-relaxed break-all whitespace-normal overflow-hidden">
            <div style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
              <Latex>{typeof answer === 'string' ? answer : ''}</Latex>
              {typeof answer !== 'string' && answer}
            </div>
          </div>
        </div>
        {onCanceled && (
          <img
            className="absolute h-6 cursor-pointer px-2 top-[-10%] right-[-10%] z-10"
            src={ImageCancelCircle}
            onClick={onCanceled}
            alt="Cancel button"
          />
        )}
      </div>
    </div>
  );
};

export default AnswerText;