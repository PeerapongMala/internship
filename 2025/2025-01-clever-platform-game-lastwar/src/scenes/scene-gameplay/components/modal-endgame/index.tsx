import { ModalCommon } from '../modal-common';
import { GameStatus } from '@core-utils/scene/GameplayTemplate';

export function ModalEndgame({
  status,
}: {
  status?: GameStatus;
}) {
  const texts = {
    success: 'เจ๋งมาก! เธอฝ่าด่านได้แบบมืออาชีพ',
    failure: 'โอ๊ะ! ตายซะแล้ว',
  };
  return (
    <>
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
        {/* <Box count={count} text={text} /> */}
        <ModalCommon>
          <div className='relative text-center my-16' style={{ left: '50%', top: '50%', transform: 'translate(-50%, 0%)' }}>
            <div className="font-kanit relative text-[32px] text-overflow-ellipsis leading-[normal] font-bold tracking-[0] text-[#ca7940] [text-shadow:0px_4px_4px_#00000040]">
              {status === GameStatus.SUCCESS ? texts.success : texts.failure}
            </div>
          </div>
        </ModalCommon>
      </div>
    </>
  );
}
