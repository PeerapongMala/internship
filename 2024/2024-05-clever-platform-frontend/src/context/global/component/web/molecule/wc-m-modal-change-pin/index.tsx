import { useTranslation } from 'react-i18next';

import InputPin from '@domain/g02/g02-d01/g02-d01-p02-pin/component/web/molecules/wc-a-input-pin';
import API from '@domain/g03/g03-d10/g03-d10-p01-setting/api';
import PinKey from '@domain/g03/g03-d10/g03-d10-p01-setting/component/web/molecules/wc-m-pin-footer';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useState } from 'react';

const ModalChangePin = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { t } = useTranslation(['global']);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('change_pin')}
          setShowModal={setShowModal}
          className="m-3"
          customBody={<Body setShowModal={setShowModal} />}
        />
      ) : null}
    </>
  );
};

const Body = ({ setShowModal }: { setShowModal: (isShow: boolean) => void }) => {
  const [pin, setPin] = useState('');
  const [warningText, setWarningText] = useState('');
  const handleDeletePin = () => {
    setPin((prev) => {
      return prev.slice(0, -1);
    });
  };
  const handleClickPin = (number: number) => {
    setPin((prev) => {
      if (prev.length < 4) {
        return prev + number;
      }
      return prev;
    });
  };

  const handleConfirmPin = () => {
    API.Account.AccountCurrent.ChangePIN(pin)
      .then((res) => {
        if (res.status_code == 200) {
          setShowModal(false);
        } else {
          setWarningText(res.message);
        }
      })
      .catch((_) => {
        setWarningText('Unexpected Error!');
      });
  };
  return (
    <div className="">
      <div className="py-[14px] border-b-2 border-dashed border-secondary">
        <InputPin pin={pin} warning={!!warningText} />
        {warningText && (
          <div className="pt-3 text-center text-red-500 text-xl">{warningText}</div>
        )}
      </div>
      <PinKey
        handleClickPin={handleClickPin}
        handleDeletePin={handleDeletePin}
        handleConfirmPin={handleConfirmPin}
      />
    </div>
  );
};

export default ModalChangePin;
