import { useState, useEffect } from 'react';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform.tsx';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect.ts';
import { SoundKey } from '@core-utils/sound/soundController.ts';
import { SOUND_GROUPS } from '@assets/public-sound';

export const Box = ({
  text,
  count,
}: {
  text: string;
  count: number;
}): JSX.Element => {
  return (
    <>
      <div className="relative h-full w-full items-center justify-center object-center">
        {/* Decorations */}
        <RectTransform boxSize={{ width: 1280, height: 720 }}>
          <div className="animate-updown">
            <div className="animate-leftright">
              <img
                className="relative h-full w-full"
                src={PUBLIC_ASSETS_LOCATION.image.modalElements}
              />
            </div>
          </div>
        </RectTransform>
        {/* Decorations */}

        {/* Modal background */}
        {/* <img
          className="fixed w-[1280px] h-[720px]"
          alt="Score Modal Background"
          src={PUBLIC_ASSETS_LOCATION.image.countdownModal}
        /> */}
        <div
          style={{
            // width: 732,
            height: 283,
            left: '20%',
            right: '20%',
            top: '50%',
            bottom: 0,
            transform: 'translate(0, -50%)',
            position: 'absolute',
            background: 'linear-gradient(180deg, #FFCCDE 0%, #FF4E87 100%)',
            borderRadius: 75,
            border: '3px #D42F68 solid',
          }}
        >
          <div
            style={{
              // width: 692,
              // height: 237,
              left: 21,
              right: 21,
              top: 20,
              bottom: 20,
              position: 'absolute',
              background: 'white',
              borderRadius: 50,
            }}
          />
          <div
            className="absolute text-center"
            style={{
              left: 30,
              right: 30,
              top: '50%',
              // bottom: 0,
              transform: 'translate(0, -50%)',
            }}
          >
            <span className="font-cherry-bomb-one text-center text-[40px] font-bold text-[#fe6a9c]">
              {text}
            </span>
            <br />
            <span className="font-kanit rotate-[0deg] text-center text-9xl font-extrabold text-[#ff5f95]">
              {count}
            </span>
          </div>
          {/* <div
            className='absolute text-center rotate-[0deg] font-kanit font-extrabold text-[#ff5f95] text-9xl tracking-[5.12px] leading-[normal]'
            style={{
              left: 0,
              right: 0,
              top: '50%',
              // bottom: 0,
              transform: 'translate(0, -70px)',
            }}
          >
          </div> */}
        </div>
        {/* </div> */}
        {/* </div> */}

        {/* <div className="fixed w-[717px] h-[332px] top-0 left-0"> */}
        {/* <div className='fixed w-[717px] h-[332px]'>
          <div className='relative w-[713px] h-[332px] bg-[#f2b52a] rounded-[39px] shadow-[0px_10px_0px_#9f5d07]'>
            <div className='absolute w-[662px] h-[297px] top-[15px] left-[23px] bg-[#fff9e9] rounded-[25px] shadow-[0px_4px_3px_#9f5d07b2]' />

            <div className='absolute top-[52px] left-[75px] [text-shadow:0px_4px_4px_#00000040] font-kanit font-bold text-[#ca7940] text-[40px] tracking-[0] leading-[normal]'>
              เตรียมตัว! ความสนุกเริ่มขึ้นแล้วใน
            </div> */}
      </div>
      {/* </div>
      </div> */}
    </>
  );
};

export function CountdownModal({
  seconds,
  text,
  onFinish,
}: {
  seconds: number;
  text: string;
  onFinish?: () => void;
}) {
  // const texts = {
  //   start: 'ภารกิจรอบใหม่ เริ่มแล้ว!',
  //   continue: 'เกมกำลังจะเริ่มต่อใน',
  // };

  const [count, setCount] = useState(seconds);
  const [showCountdown, setShowCountdown] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const { playEffect } = useSoundEffectStore();

  useEffect(() => {
    setCount(seconds);
    setFadeOut(false);
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [seconds]);

  // Countdown + เสียง (with tab visibility handling)
  useEffect(() => {
    // Don't run countdown if tab is hidden
    if (document.hidden) {
      return;
    }

    // When count reaches 0, finish the countdown
    if (count <= 0) {
      playEffect(SOUND_GROUPS.sfx.start_end as SoundKey);
      setFadeOut(true);
      setTimeout(() => {
        setShowCountdown(false);
        if (onFinish) onFinish?.();
      }, 500);

      return;
    }

    // Play countdown sound for each number (3, 2, 1)
    playEffect(SOUND_GROUPS.sfx.start_sound as SoundKey);
    const timer = setTimeout(() => {
      // Check again before decrementing (in case tab became hidden)
      if (!document.hidden) {
        setCount((c) => c - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  // Re-trigger countdown when tab becomes visible
  const [visibilityTrigger, setVisibilityTrigger] = useState(0);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && count > 1) {
        // Force re-trigger the countdown effect by changing visibilityTrigger
        setVisibilityTrigger((v) => v + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [count]);

  // Re-run countdown effect when visibility changes
  useEffect(() => {
    if (visibilityTrigger === 0 || document.hidden || count <= 1) return;

    const timer = setTimeout(() => {
      if (!document.hidden) {
        setCount((c) => c - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [visibilityTrigger]);

  // useEffect(() => {
  //   if (count <= 1) {
  //     playEffect(SOUND_GROUPS.gameplay.start_end as SoundKey);
  //     onFinish?.();
  //     return;
  //   }

  //   playEffect(SOUND_GROUPS.gameplay.start_sound as SoundKey);
  //   const timer = setTimeout(() => setCount((c) => c - 1), 1000);
  //   return () => clearTimeout(timer);
  // }, [count]);

  if (!showCountdown) return null;

  // Don't show 0, but allow fadeOut animation to complete
  if (count <= 0 && !fadeOut) return null;
  const opacityClass = fadeOut ? 'opacity-0' : fadeIn ? 'opacity-100' : 'opacity-0';

  // Show last visible number during fadeOut (show 1 instead of 0)
  const displayCount = count <= 0 ? 1 : count;

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${opacityClass}`}
    >
      {/* <Box text={texts[phase]} count={count} /> */}
      <Box text={text} count={displayCount} />
    </div>
  );
}
