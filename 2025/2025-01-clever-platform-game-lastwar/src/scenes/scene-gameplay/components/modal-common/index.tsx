import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform.tsx';
import { ScrollableModal } from '@/utils/core-utils/ui/scrollable-modal/ScrollableModal';
import { Anchor } from '@/utils/core-utils/ui/rect-transform/type';

const Carrots = () => {
  return (
    <div className="h-[134px] w-[171px]">
      <div className="relative h-[134px] w-[171px]">
        <RectTransform
          boxSize={{ width: 123, height: 123 }}
          position={{ x: -25, y: -10 }}
          rotation={-30}
          scale={{ x: 0.75, y: 0.75 }}
        >
          <img src={PUBLIC_ASSETS_LOCATION.image.carrot} />
        </RectTransform>
        <img
          className="absolute top-1 left-11 aspect-[0.98] h-[130px] w-[127px] object-cover"
          src={PUBLIC_ASSETS_LOCATION.image.carrot}
        />
      </div>
    </div>
  );
};

export const ModalCommon = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <ScrollableModal>
        {/* <div className="h-[332px] w-[713px]"> */}
        {/* <div className="fixed w-[717px] h-[332px] top-0 left-0"> */}
        <div className="h-fit max-w-[717px] m-20">
          <div className="relative h-fit max-w-[712px] pt-[15px] pb-[24px] px-[24px] rounded-[39px] bg-[#f2b52a] shadow-[0px_10px_0px_#9f5d07]">
            <div className="relative flex flex-col h-fit p-[24px] rounded-[25px] bg-[#fff9e9] shadow-[0px_4px_3px_#9f5d07b2]">
              {/* <div className="absolute top-[50%] right-[0%] transform -translate-x-1/2 -translate-y-1/2"> */}
              {children}
            </div>

            <RectTransform
              boxSize={{ width: 170, height: 130 }}
              pivot={{ x: 0.5, y: 0.75 }}
              anchor={Anchor.BottomRight}
            >
              <Carrots />
              {/* </div> */}
            </RectTransform>
          </div>
        </div>
        {/* </div> */}
      </ScrollableModal>
    </>
  );
};
