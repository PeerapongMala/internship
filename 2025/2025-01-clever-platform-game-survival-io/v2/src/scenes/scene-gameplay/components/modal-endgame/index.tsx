import { GameStatus } from '@core-utils/scene/GameplayTemplate';
import { ModalCommon } from '../modal-common';

export function ModalEndgame({ status }: { status?: GameStatus; }) {
  const texts = {
    success: 'ภารกิจผ่านฉลุย!',
    failure: 'โอ๊ะ! ตายซะแล้ว',
  };
  return (
    <>
      <ModalCommon>
        <span className="font-kanit text-center text-[40px] font-bold text-white">
          {status === GameStatus.SUCCESS ? texts.success : texts.failure}
        </span>
      </ModalCommon>
    </>
  );
}
