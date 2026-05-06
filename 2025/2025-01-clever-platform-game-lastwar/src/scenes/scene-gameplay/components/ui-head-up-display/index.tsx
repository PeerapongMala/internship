import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

export const UI_HUD = (props: {
  round: number;
  score: number;
  seconds: number;
  timeString?: string;
  isPause?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  // lives?: number;
}) => {
  const texts = {
    round: 'รอบที่ ',
  };
  return (
    <div className="absolute flex h-screen w-screen items-center justify-center overflow-hidden pointer-events-none">
      {/* Pause button */}
      {!props.isPause &&
        <div className="absolute right-0 bottom-0 -translate-x-[15px] -translate-y-[15px] pointer-events-auto">
          <button
            // className="relative"
            onClick={() => {
              void playSoundEffect(SOUND_GROUPS.sfx.gui_button);
              props.isPause ? props.onResume?.() : props.onPause?.();
            }}>
            <img
              src={PUBLIC_ASSETS_LOCATION.image.pauseBtn}
              className="h-auto w-[64px] md:w-[72px]"
            />
          </button>
        </div>
      }

      <div className="absolute left-0 top-0 translate-x-[15px] translate-y-[15px]">
        <div className="relative">
          {/* Shadow/Stroke layer */}
          <div
            className="font-kanit absolute text-left font-bold text-transparent [-webkit-text-stroke:1.3vw_#8F3F16]"
            aria-hidden="true"
            style={{
              fontSize: 'clamp(12px, 5vw, 48px)'
            }}
          >
            {texts.round}
            {props.round}
          </div>
          {/* Main text layer */}
          <div className="font-kanit relative text-left font-bold text-white"
            style={{
              fontSize: 'clamp(12px, 5vw, 48px)'
            }}
          >
            {texts.round}
            {props.round}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 -translate-x-[15px] translate-y-[15px]">
        <div className="relative">
          <img
            src={PUBLIC_ASSETS_LOCATION.image.scoreBadge}
            className="h-auto w-[122px] md:w-[244px]"
          />
          <div
            className="font-kanit absolute left-0 right-0 top-0 text-center font-bold text-white [text-shadow:_0_2px_4px_rgb(127_127_127_/_0.8)] text-[15px] translate-x-[5px] translate-y-[2.5px] md:text-[30px] md:translate-x-[10px] md:translate-y-[5px]"
          >
            {props.score}
          </div>
          <div
            className="font-kanit absolute left-0 right-0 top-0 text-center font-bold [text-shadow:_0_2px_4px_rgb(127_127_127_/_0.8)] text-[20px] translate-y-[15px] md:text-[40px] md:translate-y-[30px]"
            style={{
              color: props.seconds <= 30 ? 'red' : 'white',
            }}
          >
            {props.timeString}
          </div>
        </div>
      </div>
    </div>
  );
};
