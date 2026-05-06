import { GameConfig } from '../../../type';
import ButtonSoundOn from '../atoms/wc-a-button-sound-on';

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  useSoundDescriptionOnly?: boolean;
  soundUrl?: string;
  gameConfig?: GameConfig;
}

const Body = ({ children, className, useSoundDescriptionOnly, soundUrl, gameConfig }: BodyProps) => {
  const isLearnMode = gameConfig?.questionType === 'learn';
  const baseClasses = "relative flex flex-grow w-full rounded-b-[35px] gap-2 overflow-auto leading-10 font-light";
  const paddingClass = isLearnMode ? '' : 'p-4';

  return (
    <div className={`${baseClasses} ${paddingClass}`.trim()}>
      {useSoundDescriptionOnly ? (
        <ButtonSoundOn className="w-10 h-10" sound={soundUrl} enabledSoundSlow isPlaying />
      ) : (
        <div className={`flex flex-col w-full gap-4 ${className}`}>{children}</div>
      )}
    </div >
  );
};

export default Body;
