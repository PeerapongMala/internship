import { useTranslation } from 'react-i18next';

import StoreGame from '@global/store/game';
import ImageCancelCircle from '../../../assets/cancel-circle.png';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
import ButtonBlue from '../atoms/wc-a-button-blue';

const Modal = ({
  title,
  setShowModal,
  selected,
  onOk,
  customBody,
}: {
  title: string;
  setShowModal: any;
  selected: any;
  onOk?: any;
  customBody?: any;
}) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="bg-white h-[70%] w-[90%] rounded-[60px] p-2">
          <div className="flex flex-col bg-[#DADADA] h-full w-full rounded-[55px]">
            <HeaderModal setShowModal={setShowModal} title={title} />
            <BodyModal selected={selected} customBody={customBody} />
            {onOk && <FooterModal onOk={onOk} />}
          </div>
        </div>
      </div>
      <div className="opacity-70 absolute inset-0 z-40 w-[100000%] h-[100000%] top-[-1000%] left-[-1000%] bg-black"></div>
    </>
  );
};

const HeaderModal = ({ setShowModal, title }: { setShowModal: any; title: string }) => {
  return (
    <div className="flex relative w-full justify-center border-b-2 border-dashed border-secondary py-4">
      <div className="text-3xl font-bold">{title}</div>
      <img
        className="absolute h-8 right-11 cursor-pointer"
        src={ImageCancelCircle}
        onClick={() => setShowModal(false)}
      />
    </div>
  );
};

const BodyModal = ({ selected, customBody }: { selected: any; customBody?: any }) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  return (
    <div className="grid grid-cols-7 h-full z-50">
      {stateFlow !== STATEFLOW.Honer ? (
        <>
          <img
            className="relative top-[-7%] h-80 col-span-3 self-center justify-self-center"
            src={
              stateFlow === STATEFLOW.Frame || stateFlow === STATEFLOW.Gift
                ? selected.image_url || selected.image_url
                : selected.src
            }
          />

          <div className="col-span-4 pt-10 pr-10 text-3xl font-light leading-relaxed right-[35%] top-[30%]">
            {customBody ? customBody : selected ? selected.description : 'Name'}
          </div>
        </>
      ) : (
        // Render your component or JSX when stateFlow === STATEFLOW.Honer
        <>
          <div className={`z-10 opacity-100`}>
            <img
              src={selected.template_path}
              alt="Badge background"
              className="absolute w-[35%] h-[20%] z-20 top-[35%] left-[10%]"
            />
            <img
              src={selected.image_url}
              alt="Badge image"
              className="absolute w-[8%] h-[13%] top-[36%] left-[12%] z-30"
            />
            <div className="w-[50%] h-[100%] absolute z-30 top-[20%]">
              <p className="absolute text-white w-full text-center left-[-2%] text-[32px] pl-7 top-[20%]">
                {selected.badge_description}
              </p>
            </div>
          </div>

          <div className="col-span-4 pt-10 pr-10 text-3xl font-light leading-relaxed absolute right-[35%] top-[30%]">
            {customBody ? customBody : selected ? selected.description : 'Name'}
          </div>
        </>
      )}
    </div>
  );
};

const FooterModal = ({ onOk }: { onOk: any }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex justify-center h-20">
      <ButtonBlue onClick={onOk} text={t('use_item')} />
    </div>
  );
};

export default Modal;
