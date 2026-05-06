import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform';
import { GameStatus } from '@core-utils/scene/GameplayTemplate';

export const ModalGameOver = ({
  status,
}: {
  status?: GameStatus;
}): JSX.Element => {
  const texts = {
    success: 'ผ่านไปได้อย่างสวยงาม!',
    failure: 'โอ๊ะ! ตายซะแล้ว',
  };
  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500`}
    >
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
            <span className="font-kanit text-center text-[40px] font-bold text-[#fe6a9c]">
              {status === GameStatus.SUCCESS ? texts.success : texts.failure}
            </span>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
};
