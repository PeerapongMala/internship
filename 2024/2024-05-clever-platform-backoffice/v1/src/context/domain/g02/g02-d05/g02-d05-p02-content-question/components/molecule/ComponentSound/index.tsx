import IconSpeaker from '@core/design-system/library/component/icon/IconSpeaker';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import { useEffect, useRef } from 'react';
import SoundHelloWorld from '@asset/sound-hello-world.mp3';

const ComponentSound = ({
  isSound,
  soundUrl,
  onClickSpeaker,
  onClickDelete,
  onClickPlus,
}: {
  isSound: boolean;
  soundUrl?: string;
  onClickSpeaker?: () => void;
  onClickDelete?: () => void;
  onClickPlus?: () => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSlowRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (onClickSpeaker) {
      onClickSpeaker();
    }
  };

  const handleSlowClick = () => {
    if (audioSlowRef.current) {
      audioSlowRef.current.playbackRate = 0.5;
      audioSlowRef.current.play();
    }
    if (onClickSpeaker) {
      onClickSpeaker();
    }
  };

  useEffect(() => {
    const audioSource = soundUrl || SoundHelloWorld;
    audioRef.current = new Audio(audioSource);
    audioSlowRef.current = new Audio(audioSource);
  }, [soundUrl]);

  return (
    <div className="flex items-center gap-4">
      <div className="h-full max-h-4 w-full max-w-4">
        <div
          className={`h-4 w-4 rounded-full ${isSound ? 'bg-green-500' : 'bg-orange-600'}`}
        />
      </div>
      <div className="flex w-32 gap-4">
        {isSound && (
          <>
            <button
              type="button"
              className="btn btn-primary h-10 w-10 !rounded-full !p-0 text-white"
              onClick={handleClick}
            >
              <IconSpeaker className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="btn btn-primary h-10 w-10 !rounded-full !p-0 text-white"
              onClick={onClickDelete}
            >
              <IconTrash className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ComponentSound;
