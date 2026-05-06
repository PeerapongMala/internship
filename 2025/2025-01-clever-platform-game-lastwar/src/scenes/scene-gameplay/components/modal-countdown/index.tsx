import { useState, useEffect } from 'react';
import { ModalCommon } from '../modal-common';

export function ModalCountdown({ seconds, text }: { seconds: number, text: string }): React.ReactElement {
  const [count, setCount] = useState(seconds);

  const [_showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    if (count <= 0) {
      setShowCountdown(false);
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  // if (count <= 0) return null;

  return (
    <>
      {/* {showCountdown && ( */}
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
        {/* <Box count={count} text={text} /> */}
        <ModalCommon>
          <div className='text-center'>
            <span className="font-kanit text-[40px] leading-[normal] font-bold tracking-[0] text-[#ca7940] [text-shadow:0px_4px_4px_#00000040]">
              {text}
            </span>
            <br />
            <span className="rotate-[-2deg] [font-family:'Kanit-ExtraBold',Helvetica] text-9xl leading-[normal] font-extrabold tracking-[5.12px] text-[#a8e10c] [text-shadow:8.81px_8.81px_0px_#eaffb4e6]">
              {count}
            </span>
          </div>
        </ModalCommon>
      </div>
      {/* )} */}
    </>
  );
}
