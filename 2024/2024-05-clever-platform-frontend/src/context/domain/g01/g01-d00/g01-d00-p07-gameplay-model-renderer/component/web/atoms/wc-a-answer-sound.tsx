import ImageCancelCircle from '@global/assets/icon-cancel-circle.png';
import { useLessonLocal } from '@global/helper/lesson-local-file';
import StoreLevel from '@store/global/level';
import { useEffect, useRef } from 'react';
import ImageIconSoundOn from '../../../assets/icon-sound-on.svg';

interface IButtonProps {
  id?: string;
  choice?: string;
  sound?: string | null;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  onCanceled?: () => void;
}

const AnswerSound = ({
  id,
  choice,
  sound,
  className = '',
  onClick,
  disabled,
  selected,
  onCanceled,
}: IButtonProps) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);
  const url = useLessonLocal({
    query: queryId,
    src: sound || '',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (onClick) {
      onClick();
    }
  };

  useEffect(() => {
    if (url) audioRef.current = new Audio(url);
  }, [url]);

  return (
    <div
      id={id}
      className={`relative bg-secondary p-1 rounded-[37px] cursor-pointer border-box h-[4rem] w-full select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
          ${className}
          ${disabled ? 'brightness-75' : ''}
          `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
        touchAction: 'none',
      }}
      onClick={handleClick}
    >
      <div
        className={`
          flex justify-center items-center bg-white h-full w-full rounded-[30px] text-center px-1 font-medium
          ${selected ? '!bg-secondary-stroke' : ''}
      `}
      >
        {choice && (
          <div className="h-full">
            <div className="flex w-14 h-full justify-center items-center border-r-[2px] border-secondary">
              {choice}
            </div>
          </div>
        )}
        <div className="w-full h-full flex justify-center items-center">
          <img src={ImageIconSoundOn} alt="sound-on" className="h-11" />
        </div>
        {onCanceled && (
          <img
            className="h-8 cursor-pointer px-2"
            src={ImageCancelCircle}
            onClick={onCanceled}
          />
        )}
      </div>
    </div>
  );
};

export default AnswerSound;
