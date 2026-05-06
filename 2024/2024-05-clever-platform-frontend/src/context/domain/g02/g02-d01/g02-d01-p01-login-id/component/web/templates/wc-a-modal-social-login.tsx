import { useTranslation } from 'react-i18next';

import Modal from '@global/component/web/molecule/wc-m-modal';
import ImageButtonBlueFacebook from '../../../assets/button-blue-facebook.png';
import ImageButtonBlueGoogle from '../../../assets/button-blue-google.png';
import ImageButtonBlueLine from '../../../assets/button-blue-line.png';
import ImageButtonBlueThaiId from '../../../assets/button-blue-thaiId.png';
import ConfigJson from '../../../config/index.json';

const ModalSocialLogin = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('login_with_other_methods')}
          setShowModal={setShowModal}
          className="h-[80%] w-[56%]"
          customBody={<Body />}
        />
      ) : null}
    </>
  );
};

const Body = () => {
  return (
    <div className="flex flex-col w-full items-center pt-7">
      <div className="w-96 relative h-28">
        <img src={ImageButtonBlueLine} alt="line" className="w-96 absolute" />
        <div className="absolute w-96 h-20 cursor-pointer"></div>
      </div>
      <div className="w-96 relative h-28">
        <img src={ImageButtonBlueThaiId} alt="line" className="w-96 absolute" />
        <div className="absolute w-96 h-20 cursor-pointer"></div>
      </div>
      <div className="w-96 relative h-28">
        <img src={ImageButtonBlueGoogle} alt="line" className="w-96 absolute" />
        <div className="absolute w-96 h-20 cursor-pointer"></div>
      </div>
      <div className="w-96 relative h-28">
        <img src={ImageButtonBlueFacebook} alt="line" className="w-96 absolute" />
        <div className="absolute w-96 h-20 cursor-pointer"></div>
      </div>
    </div>
  );
};

export default ModalSocialLogin;
