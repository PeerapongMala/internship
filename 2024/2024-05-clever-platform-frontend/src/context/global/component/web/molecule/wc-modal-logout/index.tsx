import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useTranslation } from 'react-i18next';

const ModalLogout = ({
  showModal,
  setShowModal,
  onOK,
}: {
  showModal: boolean;
  setShowModal: any;
  onOK: () => void;
}) => {
  const { t } = useTranslation(['global']);
  // wating for i18n
  return (
    <>
      {showModal ? (
        <Modal
          title={t('ยืนยันการออกจากระบบ')}
          setShowModal={setShowModal}
          className="h-[16rem] w-[40rem]"
          customBody={<Body setShowModal={setShowModal} onOK={onOK} />}
        />
      ) : null}
    </>
  );
};

const Body = ({ setShowModal, onOK }: { setShowModal: any; onOK: () => void }) => {
  const { t } = useTranslation(['global']);

  return (
    <div className="w-full  flex flex-col items-center justify-center p-4">
      <p className="text-lg mb-8">{t('คุณต้องการออกจากระบบหรือไม่')}</p>
      <div className="flex gap-4 w-full justify-center">
        <Button
          onClick={() => setShowModal(false)}
          variant="tertiary"
          size="medium"
          width="10rem"
        >
          {t('ยกเลิก')}
        </Button>
        <Button
          onClick={() => {
            onOK();
            setShowModal(false);
          }}
          variant="danger"
          size="medium"
          width="10rem"
        >
          {t('ยืนยัน')}
        </Button>
      </div>
    </div>
  );
};

export default ModalLogout;
