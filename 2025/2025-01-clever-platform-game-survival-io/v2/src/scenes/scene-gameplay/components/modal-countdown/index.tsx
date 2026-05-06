import { useEffect } from 'react';
import { ModalCommon } from '../modal-common';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

export function ModalCountdown({ seconds, text }: { seconds: number, text: string }) {
  // const [count, setCount] = useState(seconds);

  // const [showCountdown, setShowCountdown] = useState(true);

  // useEffect(() => {
  //   if (count <= 0) {
  //     setShowCountdown(false);
  //     return;
  //   }
  //   const timer = setTimeout(() => setCount(count - 1), 1000);
  //   return () => clearTimeout(timer);
  // }, [count]);

  // if (count <= 0) return null;

  useEffect(() => {
    // Play a countdown start cue when countdown modal appears
    void playSoundEffect(SOUND_GROUPS.sfx.countdown_start);
  }, []);

  return (
    <>
      {/* {showCountdown && ( */}
      <ModalCommon>
        <div className="text-center">
          <span className="font-kanit text-center text-[40px] font-bold text-white">
            {text}
          </span>
          <br />
          <span className="font-sarpanch rotate-[0deg] text-center text-9xl font-extrabold text-white">
            {seconds}
          </span>
        </div>
      </ModalCommon>
      {/* )} */}
    </>
  );
}
