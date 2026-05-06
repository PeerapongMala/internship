import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

export const ScoreModal = (props: {
  round: number;
  score: number;
  level: number;
  stars: number;
  timeString: string;
  onPlayAgainBtnClick?: () => void;
  onBackToMenuBtnCLick?: () => void;
}) => {
  // Game data that could be passed as props in a real application
  const texts = {
    title: 'จบเกม',
    round: 'รอบ: ',
    levelLabel: 'เลเวล ',
    scoreLabel: 'คะแนน: ',
    timeLabel: 'เวลา: ',
    playAgainButton: 'เล่นอีกครั้ง',
    homeButton: 'หน้าแรก',
    weaponLabel: 'อาวุธที่ใช้: ',
  };

  return (
    <>
      {/* Score modal */}
      <div className="h-fit max-w-[533px]">
        {/* <RectTransform boxSize={{ width: 533, height: 586 }}> */}

        {/* Level label */}
        {/* Level display */}
        <div
          className="absolute items-center gap-1 text-center text-white"
          style={{
            left: 0,
            right: 0,
            top: 0,
            // transform: 'translateY(-50%)',
          }}
        >
          <span className="font-kanit text-[24px] font-normal">{texts.levelLabel}</span>
          <span className="font-sarpanch text-[24px] font-normal">{props.level}</span>
        </div>

        <div className="relative flex h-fit w-full max-w-[533px] flex-col items-center justify-around">
          {/* Score modal Badge */}
          <div className="relative h-fit w-full">
            <img
              className="relative h-fit w-full"
              alt="Score Modal Badge"
              src={PUBLIC_ASSETS_LOCATION.image.scoreModal}
            />
            {props.stars === 0 && (
              <img
                className="absolute h-fit w-full translate-y-[-60%] px-[20%]"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.stars0}
              />
            )}
            {props.stars === 1 && (
              <img
                className="absolute h-fit w-full translate-y-[-60%] px-[20%]"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.stars1}
              />
            )}
            {props.stars === 2 && (
              <img
                className="absolute h-fit w-full translate-y-[-60%] px-[20%]"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.stars2}
              />
            )}
            {props.stars === 3 && (
              <img
                className="absolute h-fit w-full translate-y-[-60%] px-[20%]"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.stars3}
              />
            )}
            {/* <div
              className='absolute w-full h-[30%] translate-y-[-60%] bg-black opacity-80'
            >
              <div className="relative w-[10%] h-[50%] left-[50%] translate-x-[-25%] bg-white opacity-70">
                <img
                  className='absolute w-full h-full'
                  src={PUBLIC_ASSETS_LOCATION.image.special.starFill}
                />
              </div>
            </div> */}
          </div>

          {/* Score modal stat */}
          <div className="relative inline-flex w-full flex-wrap content-start justify-around gap-x-4 px-10">
            {/* Score label */}
            {/* Score display */}
            <div className="flex w-fit flex-row items-center gap-1 text-center leading-[normal] tracking-[0] text-white">
              <span className="font-kanit text-[24px] font-normal">
                {texts.scoreLabel}
              </span>
              <span className="font-sarpanch text-[36px] font-bold">{props.score}</span>
            </div>

            {/* Time label */}
            {/* Timer display */}
            <div className="flex w-fit flex-row items-center gap-1 text-center leading-[normal] tracking-[0] text-white">
              <span className="font-kanit text-[24px] font-normal">
                {texts.timeLabel}
              </span>
              <span className="font-sarpanch text-[36px] font-bold">
                {props.timeString}
              </span>
            </div>

            {/* Round label */}
            {/* Round display */}
            <div className="flex w-fit flex-row items-center gap-1 text-center leading-[normal] tracking-[0] text-white">
              <span className="font-kanit text-[24px] font-normal">{texts.round}</span>
              <span className="font-sarpanch text-[36px] font-bold">{props.round}</span>
            </div>
          </div>

          {/* Decorations */}
          {/* <RectTransform boxSize={{ width: 1280, height: 720 }}> */}
          <img
            className="relative h-[42px] w-fit"
            src={PUBLIC_ASSETS_LOCATION.image.scoreModalElements}
          />
          {/* </RectTransform> */}

          <div className="inline-flex w-full flex-wrap content-center items-center justify-center gap-4">
            <span className="font-kanit text-[16px] font-normal text-white">
              {texts.weaponLabel}
            </span>

            <div className="inline-flex w-full flex-wrap content-center items-center justify-center gap-4">
              <img
                className="relative h-fit w-fit"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.weaponFrame}
              />

              <img
                className="relative h-fit w-fit"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.weaponFrame}
              />

              <img
                className="relative h-fit w-fit"
                src={PUBLIC_ASSETS_LOCATION.image.special.score.weaponFrame}
              />

              <div className="inline-flex w-fit flex-wrap content-center items-center justify-center gap-4">
                <img
                  className="relative h-fit w-fit"
                  src={PUBLIC_ASSETS_LOCATION.image.special.score.weaponFrame}
                />

                <img
                  className="relative h-fit w-fit"
                  src={PUBLIC_ASSETS_LOCATION.image.special.score.weaponFrame}
                />
              </div>
            </div>
          </div>

          <img
            className="relative h-[42px] w-fit"
            src={PUBLIC_ASSETS_LOCATION.image.scoreModalElements}
          />
          {/* Decorations */}

          <div className="gab-4 mt-4 mb-6 inline-flex h-fit w-full flex-wrap content-center items-center justify-evenly">
            {/* Back to Main Menu button */}
            <button
              className="animate-idlebutton transition duration-300 hover:scale-110"
              onClick={props.onBackToMenuBtnCLick}
              onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.mainMenuBtn} />
            </button>
            {/* Play Again button */}
            {/* <button
              className="animate-idlebutton transition duration-300 hover:scale-110"
              onClick={props.onPlayAgainBtnClick}
            >
              <img
                className="h-[60px] w-fit"
                src={PUBLIC_ASSETS_LOCATION.image.playAgainBtn}
              />
            </button> */}
          </div>
        </div>

        {/* <RectTransform
          boxSize={{ width: 64, height: 64 }}
          anchor={Anchor.TopRight}
          position={{ x: -50, y: 100 }}
        >
          <button
            className='relative w-full h-full hover:scale-110 transition duration-300'
            onClick={handlePlayAgain}
          >
            <img src={PUBLIC_ASSETS_LOCATION.image.playAgainBtn} />
          </button>
        </RectTransform> */}

        {/* </RectTransform > */}
      </div>
    </>
  );
};

export default ScoreModal;
