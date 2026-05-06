import { useEffect, useRef } from 'react';

import { useLessonLocal } from '@global/helper/lesson-local-file';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import ImageIconSoundOn from '../../../assets/icon-sound-on.svg';
import ImageIconSoundSlow from '../../../assets/icon-sound-slow.svg';

interface ButtonSoundOnProps {
  sound?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  enabledSoundSlow?: boolean;
  isPlaying?: boolean;
}

const ButtonSoundOn = ({
  sound,
  onClick,
  className,
  disabled,
  enabledSoundSlow,
  isPlaying,
}: ButtonSoundOnProps) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);
  const { settings } = StoreGlobalPersist.StateGet(['settings']);
  const url = useLessonLocal({
    query: queryId,
    src: sound || '',
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSlowRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (url) {
      audioRef.current = new Audio(url);
      audioSlowRef.current = new Audio(url);
    }
  }, [url]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef.current]);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (onClick) {
      onClick();
    }
  };

  const handleSlowClick = () => {
    if (audioSlowRef.current) {
      audioSlowRef.current.playbackRate = 0.5;
      audioSlowRef.current.play();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative flex rounded-full cursor-pointer h-14 select-none
        ${enabledSoundSlow ? 'w-44' : 'w-14'}
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className={`flex justify-center items-center bg-white border-secondary border-4 border-r-2 h-full w-full text-center px-1 
          transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
          ${enabledSoundSlow ? 'rounded-l-[30px]' : 'rounded-full'}
          `}
        onClick={handleClick}
      >
        <img src={ImageIconSoundOn} alt="sound-on" className="h-11" />
      </div>
      {enabledSoundSlow && (
        <div
          className="flex justify-center items-center bg-white border-secondary border-4 border-l-2 h-full w-full rounded-r-[30px] text-center px-1 transition active:translate-y-0.5 hover:translate-y-[-0.125rem]"
          onClick={handleSlowClick}
        >
          <img src={ImageIconSoundSlow} alt="sound-slow" className="h-11" />
        </div>
      )}
    </div>
  );
};

export default ButtonSoundOn;
