import { useTranslation } from 'react-i18next';

import ImageIconWifiOff from '@global/assets/icon-wifi-off.svg';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';

const ModalOffLine = ({
  showModal,
  setShowModal,
  onOk,
}: {
  showModal: boolean;
  setShowModal: any;
  onOk?: any;
}) => {
  const { t } = useTranslation(['global']);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('open_offline_mode')}
          setShowModal={setShowModal}
          className="h-[55%] w-[60%]"
          customBody={<Body />}
          customFooter={<Footer onOk={onOk} />}
        />
      ) : null}
    </>
  );
};

const Body = () => {
  const { t } = useTranslation(['global']);

  return (
    <div className="flex flex-col gap-4 w-full items-center pt-7 border-b-2 border-dashed border-secondary text-3xl pb-10">
      <div className="font-semibold">{t('please_use_this_mode')}</div>
      <div className="w-full text-balance text-center">
        {t('your_play_data_can_be_seen_by_everyone')}
      </div>
    </div>
  );
};

const Footer = ({ onOk }: { onOk?: any }) => {
  const { t } = useTranslation(['global']);

  return (
    <div className="flex justify-center items-center w-full pt-5 text-xl">
      <Button
        prefix={<img src={ImageIconWifiOff} className="h-9 w-10 p-[1px] pl-1" />}
        onClick={onOk}
        variant="danger"
        width="40rem"
        height="65px"
        textClassName="justify-center items-center text-[25px] pr-4"
      >
        {t('play_offline')}
      </Button>
    </div>
  );
};

export default ModalOffLine;
