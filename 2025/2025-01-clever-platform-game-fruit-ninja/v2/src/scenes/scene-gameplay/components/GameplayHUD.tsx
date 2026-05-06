import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { playSoundUI } from '@/components/ui/play-sound-ui';

const LiveRemaining = ({ lives: lives }: { lives: number }) => {
  return (
    <div className="absolute top-0 right-0 p-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <img src={PUBLIC_ASSETS_LOCATION.image.lifeCountBG} alt="Life Count Background" />
      <div className="absolute top-0 right-0 p-4">
        <div className="flex flex-row-reverse items-center space-x-3 space-x-reverse">
          {Array.from({ length: lives }).map((_, index) => (
            <img
              key={index}
              src={PUBLIC_ASSETS_LOCATION.image.lifeCount}
              alt="Life Icon"
            // className='w-6 h-6'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const GameplayHUD = (props: {
  round: number;
  score: number;
  seconds: number;
  timeString?: string;
  lives?: number;
  isPause?: boolean;
  isSystemPause?: boolean; // True when paused by system (no UI), false when paused by user
  onPause?: () => void;
  onResume?: () => void;
  comboMultiplier?: number;
}) => {
  const texts = {
    round: 'รอบที่',
    score: 'คะแนน',
    combo: 'ครั้งต่อเนื่อง',
  };

  return (
    // <RectTransform
    //   boxSize={{ width: 244, height: 155 }}
    //   position={{ x: 0, y: 15 }}
    //   anchor={Anchor.TopRight}
    //   pivot={Pivot.TopRight}
    //   showPivot
    // >
    <div className="absolute flex h-screen w-screen items-center justify-center overflow-hidden">
      {/* Show dark overlay when paused (both user and system pause) */}
      {props.isPause && (
        <div className="bg-opacity-70 pointer-events-none absolute inset-0 z-10 bg-black"></div>
      )}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: 0,
          transform: 'translateY(20px)',
        }}
      >
        {/* Round BG */}
        <img
          className="absolute"
          style={{
            left: '50%',
            top: 0,
            transform: 'translate(-50%, 0)',
          }}
          src={PUBLIC_ASSETS_LOCATION.image.scoreBadge}
        />

        {/* Lives Remaining */}
        <LiveRemaining lives={props.lives || 0} />

        {/* Score display */}
        <div
          className="font-cherry-bomb-one absolute text-center text-[50px] font-bold text-[#fe679a] [-webkit-text-stroke:8px_#ffffff]"
          style={{
            top: 0,
            left: 0,
            transform: 'translate(50px, 0px)',
          }}
        >
          {props.score}
          <div
            className="font-cherry-bomb-one relative text-center text-[50px] font-bold text-[#fe679a] [-webkit-text-stroke:0px_#ffffff]"
            style={{
              top: 0,
              left: 0,
              transform: 'translate(0px, -75px)',
            }}
          >
            {props.score}
            <div
              className="font-cherry-bomb-one relative text-center text-[20px] font-bold text-[#fe679a] [-webkit-text-stroke:5px_#ffffff]"
              style={{
                top: 0,
                left: 0,
                transform: 'translate(45px, -30px)',
              }}
            >
              {texts.score}
              <div
                className="font-cherry-bomb-one relative text-center text-[20px] font-bold text-[#fe679a] [-webkit-text-stroke:0px_#ffffff]"
                style={{
                  top: 0,
                  left: 0,
                  transform: 'translate(0px, -30px)',
                }}
              >
                {texts.score}
              </div>
            </div>
          </div>
        </div>

        {/* Score label */}

        {/* Round label and display */}
        <div
          className="font-kanit absolute text-center text-[30px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            left: 0,
            right: 0,
            top: 0,
            transform: 'translateY(25px)',
          }}
        >
          {texts.round} {props.round}
        </div>

        {/* Time display */}
        <div
          className="font-cherry-bomb-one absolute text-center text-[30px] font-bold"
          style={{
            top: 0,
            left: 0,
            right: 0,
            transform: 'translate(0%, 80px)',
            color: props.seconds <= 30 ? 'red' : '#fe679a',
            textShadow: `
              2px 2px 1px white,
              -2px -2px 1px white,
              2px -2px 1px white,
              -2px 2px 1px white
            `,
          }}
        >
          {props.timeString}
        </div>
      </div>

      {/* Pause screen - only show when user paused (not system pause) */}
      {props.isPause && !props.isSystemPause && (
        <div className="absolute z-[999] flex flex-col items-center justify-center">
          {/* playing Circle */}
          <img
            className="h-[200px] w-[200px] object-contain"
            src={PUBLIC_ASSETS_LOCATION.image.textStopgame}
            alt="Text Stop Game"
          />
          {/* <div>
            <h1 className="w-[200px] font-cherry-bomb-one  text-center text-[42px] font-bold text-white [-webkit-text-stroke:1px_#ffffff]"
            >
              หยุดเกม
            </h1>
          </div> */}

          {/* playing Circle */}
          <img
            onClick={() => {
              props.onResume?.();
              playSoundUI();
            }}
            className="hover:bg-opacity-90 cursor-pointer object-contain transition-transform duration-300 ease-out hover:scale-110 active:scale-90"
            src={PUBLIC_ASSETS_LOCATION.image.resumeBtn}
            alt="Play Background"
          />
        </div>
      )}

      {!props.isPause && (
        <div className="hover:bg-opacity-90 absolute bottom-5 left-5 flex h-16 w-16 cursor-pointer items-center justify-center transition-transform duration-300 ease-out hover:scale-110 active:scale-90">
          <button
            onClick={() => {
              props.onPause?.();
              playSoundUI();
            }}
          >
            <div className="relative h-full w-full">
              {/* Background Circle */}
              <img
                className="h-full w-full object-contain"
                src={PUBLIC_ASSETS_LOCATION.image.pauseBtn}
                alt="Pause Background"
              />
            </div>
          </button>
        </div>
      )}

      {/* <button
        className="absolute bottom-5 left-4 bg-[#fe679a]  font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-opacity-90
          font-cherry-bomb-one 
          "

      >
        <p className='text-white'>Pause</p>
      </button> */}
    </div>
  );
};
