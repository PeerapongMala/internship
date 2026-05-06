import { STATEFLOW } from '@domain/g03/g03-d04/g03-d04-p01-avatar-custom/interfaces/stateflow.interface';
import Modal from '@global/component/web/molecule/wc-m-modal';
import StoreGame from '@global/store/game';

const ModalShop = ({
  showModal,
  title,
  setShowModal,
  selected,
  customBody,
  customFooter,
  onOk,
  couponData,
}: {
  showModal: boolean;
  couponData: any;
  title: string;
  setShowModal: any;
  selected: any;
  customBody?: any;
  customFooter?: any;
  onOk?: any;
}) => {
  console.log('couponData in modal: ', couponData);
  console.log('selected in modal: ', selected);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  return (
    <>
      {showModal ? (
        <Modal
          title={title}
          setShowModal={setShowModal}
          className="h-[70%] w-[90%]"
          customBody={<BodyModal selected={selected} customBody={customBody} />}
          customFooter={customFooter}
        />
      ) : null}
    </>
  );
};

const BodyModal = ({ selected, customBody }: { selected: any; customBody?: any }) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  return (
    <div className="grid grid-cols-7 h-full">
      {stateFlow === STATEFLOW.Gift ? (
        <img
          className="h-60 col-span-3 self-center justify-self-center"
          src={selected ? selected.image_url : ''}
        />
      ) : (
        // Your second condition here, replace this part with the content you want to render
        <img
          className="h-60 col-span-3 self-center justify-self-center"
          src={selected ? selected.src : ''}
        />
      )}

      <div className="col-span-4 pt-10 pr-10 text-3xl font-light leading-relaxed">
        {customBody ? customBody : selected ? selected.description : 'Name'}
      </div>
    </div>
  );
};

export default ModalShop;
