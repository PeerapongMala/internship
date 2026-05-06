import ButtonSoundOn from '../atoms/wc-a-button-sound-on';

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  useSoundDescriptionOnly?: boolean;
  soundUrl?: string;
}

const Body = ({ children, className, useSoundDescriptionOnly, soundUrl }: BodyProps) => {
  return (
    <div className="relative flex flex-grow w-ful rounded-b-[35px] p-4 gap-2 overflow-auto leading-10 font-light">
      {useSoundDescriptionOnly ? (
        <ButtonSoundOn className="w-10 h-10" sound={soundUrl} enabledSoundSlow isPlaying />
      ) : (
        <div className={`flex flex-col w-full gap-4 ${className}`}>{children}</div>
      )}
    </div>
  );
};

export default Body;
