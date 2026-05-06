import StoreGame from '@global/store/game';
import ImageIconInfo from '../../../assets/icon-info.png';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const ShopMenuFooter = ({
  selected,
  setShowModal,
}: {
  selected: any;
  setShowModal: any;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <>
      {selected && (
        <div className="absolute bottom-0 flex w-[92%] h-28 items-center justify-start rounded-3xl mx-4 mb-3 bg-white shadow-2xl z-20">
          <div className="flex gap-2 px-6 items-center justify-between w-full z-20">
            <div className="flex items-center">
              {stateFlow === STATEFLOW.Honer ? (
                <div className="h-28 flex items-center justify-center text-lg font-bold text-gray-600 z-50">
                  {selected.text || (
                    <div className="z-40 opacity-100">
                      <img
                        src={selected.template_path}
                        alt="Badge background"
                        className="absolute w-[45%] h-[60%] z-20 top-[25%] left-0"
                      />
                      <img
                        src={selected.image_url}
                        alt="Badge image"
                        className="absolute w-[12%] h-[50%] top-[22%] left-[2%] z-30"
                      />
                      <div className="w-full absolute z-30">
                        <p className="absolute text-white w-full text-center left-[-32%] text-[14px] pl-8 top-[-13px]">
                          {selected.badge_description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  className="w-24"
                  src={
                    stateFlow == STATEFLOW.Frame || stateFlow == STATEFLOW.Gift
                      ? selected.image_url || selected.image_url
                      : selected.src
                  }
                />
              )}

              {stateFlow === STATEFLOW.Honer && ( // Hide the image if stateFlow is STATEFLOW.Frame
                <div className="text-2xl font-semibold absolute left-[47%]">
                  {selected.name}
                </div>
              )}
              {stateFlow !== STATEFLOW.Honer && ( // Hide the image if stateFlow is STATEFLOW.Frame
                <div className="text-2xl font-semibold">{selected.name}</div>
              )}
            </div>
            {stateFlow !== STATEFLOW.Frame && stateFlow !== STATEFLOW.Honer && (
              <img
                className="h-10 cursor-pointer"
                src={ImageIconInfo}
                onClick={() => setShowModal(true)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopMenuFooter;
