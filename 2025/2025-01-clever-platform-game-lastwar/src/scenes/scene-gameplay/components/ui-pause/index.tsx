import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

export const UI_Pause = (props: { isVisible?: boolean; onResume?: () => void }) => {
  if (!props.isVisible) return null; // ไม่แสดง panel ถ้าไม่เปิดอยู่

  const texts = {
    pause: 'เกมหยุด',
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-70">
      <div className="absolute flex flex-col items-center justify-center">

        {/* Pause Text */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Shadow/Stroke layer */}
          <div
            className="font-kanit absolute text-center text-[50px] font-bold text-transparent [-webkit-text-stroke:18px_#8F3F16]"
            aria-hidden="true"
          >
            {texts.pause}
          </div>
          {/* Main text layer */}
          <div className="font-kanit relative text-center text-[50px] font-bold text-white">
            {texts.pause}
          </div>
        </div>

        {/* Add spacing between Pause Text and Resume Button */}
        <div className="h-8"></div>

        {/* Resume Button */}
        <button
          className="animate-idlebutton relative transition duration-300 hover:scale-110"
          onClick={() => {
            void playSoundEffect(SOUND_GROUPS.sfx.gui_button);
            props.onResume?.();
          }}
        >
          <img
            // className="hover:bg-opacity-90 cursor-pointer object-contain transition-transform duration-300 ease-out hover:scale-110 active:scale-90"
            src={PUBLIC_ASSETS_LOCATION.image.resumeBtn}
          />
        </button>
      </div>
    </div>
  );
};
