import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';

export const ModalCommon = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-fit w-full max-w-[732px] items-center justify-center object-center">
        <div
          className="absolute"
          style={{
            left: 30,
            right: 30,
            top: '50%',
            transform: 'translate(0, -50%)',
          }}
        >
          <img
            className="absolute h-full w-full"
            src={PUBLIC_ASSETS_LOCATION.image.countdownModal}
          />
          <div className="relative min-h-[283px] z-10 flex flex-col items-center justify-center px-4 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
