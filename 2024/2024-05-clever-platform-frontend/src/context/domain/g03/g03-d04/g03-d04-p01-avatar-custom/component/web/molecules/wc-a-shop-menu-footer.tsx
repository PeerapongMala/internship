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

  console.log('No selected check: ', selected);
  return (
    <>
      {(stateFlow === STATEFLOW.Avatar || stateFlow === STATEFLOW.Pet) &&
        selected?.name !== 'NoSelected' && (
          <div className="absolute bottom-0 flex w-[92%] h-28 items-center justify-start rounded-3xl mx-4 mb-3 bg-white shadow-2xl z-20">
            <div className="flex gap-2 px-6 items-center justify-between w-full">
              <div className="flex items-center">
                <img className="w-24" src={selected.src} />
                <div className="text-2xl font-semibold">{selected.name}</div>
              </div>

              <img
                className="h-10 cursor-pointer"
                src={ImageIconInfo}
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default ShopMenuFooter;
