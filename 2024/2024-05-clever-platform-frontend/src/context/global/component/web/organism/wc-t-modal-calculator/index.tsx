import WCMCalculator from '@component/web/molecule/wc-m-calculator';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useTranslation } from 'react-i18next';

const ModalCalculator = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { t, i18n } = useTranslation(['global']);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('calculator.title')}
          setShowModal={setShowModal}
          className="h-[40rem] w-[30rem]"
          childrenClassName="bg-white"
          customBody={
            <div className="relative flex items-center justify-center h-full">
              <WCMCalculator />
            </div>
          }
        />
      ) : null}
    </>
  );
};

export default ModalCalculator;
