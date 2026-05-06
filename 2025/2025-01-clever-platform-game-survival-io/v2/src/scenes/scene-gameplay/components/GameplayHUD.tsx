import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { SOUND_GROUPS } from '@/assets/public-sound';
import { playSoundEffect } from '@/utils/core-utils/sound';

const MAX_EXP_BARS = 20; // จำนวนขีดสูงสุดในหลอด

const GameProgress = (props: { exp: number; level: number; score: number }) => {
  // คำนวณจำนวนขีดที่ต้องแสดง (maxExp = level * 50)
  const maxExp = props.level * 50;
  const expBars = Math.min(Math.floor((props.exp / maxExp) * MAX_EXP_BARS), MAX_EXP_BARS);

  return (
    <div className="absolute top-0 right-0 p-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <img src={PUBLIC_ASSETS_LOCATION.image.gameProgressBG} />
      {/* EXP display */}
      <div className="absolute top-16 left-28 overflow-hidden">
        <div className="flex flex-row items-center space-x-[3px]">
          {Array.from({ length: expBars }).map((_, index) => (
            <img key={index} src={PUBLIC_ASSETS_LOCATION.image.expCount} />
          ))}
        </div>
      </div>

      {/* Level display */}
      <div
        className="font-sarpanch absolute flex h-auto w-[60px] items-center justify-center text-[32px] font-bold text-wrap text-white"
        style={{
          top: 65,
          left: 50,
          transform: 'translate(-25%, 0%)',
        }}
      >
        {props.level}
      </div>

      {/* Score badge */}
      <img
        className="absolute top-0 right-0 -translate-x-2 translate-y-2"
        src={PUBLIC_ASSETS_LOCATION.image.scoreBadge}
      />

      {/* Score display */}
      <div
        className="font-sarpanch absolute flex h-auto w-[60px] items-center justify-center text-[16px] font-bold text-wrap text-white"
        style={{
          top: 0,
          right: 30,
          transform: 'translate(0%, 35px)',
        }}
      >
        {props.score}
      </div>
    </div>
  );
};

export const GameplayHUD = (props: {
  round: number;
  score: number;
  seconds: number;
  timeString?: string;
  level?: number;
  exp?: number;
  isVisible?: boolean;
  onPauseClick?: () => void;
}) => {
  const texts = {
    round: 'รอบที่',
    score: 'คะแนน',
    combo: 'ครั้งต่อเนื่อง',
  };

  if (props.isVisible === false) return null; // ไม่แสดง panel ถ้าไม่เปิดอยู่

  return (
    // <RectTransform
    //   boxSize={{ width: 244, height: 155 }}
    //   position={{ x: 0, y: 15 }}
    //   anchor={Anchor.TopRight}
    //   pivot={Pivot.TopRight}
    //   showPivot
    // >
    <div className="absolute flex h-screen w-screen items-center justify-center overflow-hidden">
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: 0,
          transform: 'translateY(20px)',
        }}
      >
        <GameProgress
          exp={props.exp ?? 0}
          level={props.level ?? 1}
          score={props.score ?? 0}
        />

        {/* Time display */}
        <div
          className="font-sarpanch absolute text-center text-[48px] font-bold"
          style={{
            top: 20,
            left: 0,
            right: 0,
            transform: 'translateY(0%)',
            color: props.seconds <= 30 ? 'red' : 'white',
          }}
        >
          {props.timeString}
        </div>

        {/* Round label and display */}
        <div
          className="font-kanit absolute text-center text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          style={{
            top: 80,
            left: 0,
            right: 0,
            transform: 'translateY(0%)',
          }}
        >
          {texts.round} {props.round}
        </div>

        {/* Pause Button */}
        <div className="absolute top-0 left-0 p-4 drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <button
            onClick={props.onPauseClick}
            onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
          >
            <img
              // className="top-0 left-0 -translate-x-2 translate-y-2"
              src={PUBLIC_ASSETS_LOCATION.image.pauseBtn}
            />
          </button>
        </div>

      </div>
    </div>
  );
};
