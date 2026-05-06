import { useTranslation } from 'react-i18next';

import ImageIconEyeOff from '@global/assets/icon-eye-off.svg';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';
import ConfigJson from '../../../config/index.json';
import SelectUser from '../molecules/wc-a-select-user';
import { UserData } from '@domain/g02/g02-d01/local/type';

const ModalForgotPin = ({
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
          title={t('forgot_pin')}
          setShowModal={setShowModal}
          className="h-[40%] w-[58%]"
          customBody={<Body />}
        />
      ) : null}
    </>
  );
};

const Body = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center pt-7 text-3xl pb-10">
      <span className="">{t('please_contact_teacher_or_admin')}</span>{' '}
    </div>
  );
};

export default ModalForgotPin;
