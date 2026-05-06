import { useTranslation } from 'react-i18next';

import Bell from '@global/assets/bell.svg';
import Refresh from '@global/assets/change.svg';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal-overlay';

type ModalOffLineWarningProps = {
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOk?: () => void;
  onCancel?: () => void;
  enablePlayOffline?: boolean;
  overlay?: boolean;
};

const ModalOffLineWarning = ({
  isVisible,
  setVisible,
  onOk,
  onCancel,
  enablePlayOffline = true,
  overlay = false,
}: ModalOffLineWarningProps) => {
  const { t } = useTranslation(['global']);

  return (
    <>
      {isVisible && (
        <Modal
          title={t('you_offline_warning')}
          isVisible={isVisible}
          setVisibleModal={setVisible}
          className="w-[60%]"
          customBody={<Body enablePlayOffline={enablePlayOffline} />}
          customFooter={
            <Footer
              onOk={onOk}
              onCancel={onCancel}
              enablePlayOffline={enablePlayOffline}
            />
          }
          overlay={overlay}
        />
      )}
    </>
  );
};

interface BodyProps {
  enablePlayOffline?: boolean;
}

const Body = ({ enablePlayOffline = true }: BodyProps) => {
  const { t } = useTranslation(['global']);

  return (
    <div className="flex flex-col gap-4 w-full items-center pt-7 border-b-2 border-dashed border-secondary text-3xl pb-10 font-light">
      <div className="w-full text-balance text-center">
        {enablePlayOffline
          ? t('re_check_your_connection_or_play_offline')
          : t('re_check_you_connection')}
      </div>
    </div>
  );
};

type FooterProps = {
  onOk?: () => void;
  onCancel?: () => void;
  enablePlayOffline?: boolean;
};

const Footer = ({ onOk, onCancel, enablePlayOffline = true }: FooterProps) => {
  const { t } = useTranslation(['global']);

  return (
    <div className="flex justify-center items-center w-full pt-5 text-xl gap-10 px-5">
      <Button
        prefix={<img src={Refresh} className="h-11 w-15 p-[1px] pl-1" />}
        onClick={onOk}
        variant="tertiary"
        width="30rem"
        height="65px"
        textClassName="justify-center items-center text-[25px] pr-4"
      >
        {t('try_again')}
      </Button>
      {enablePlayOffline && (
        <Button
          prefix={<img src={Bell} className="h-9 w-10 p-[1px] pl-1" />}
          onClick={onCancel}
          variant="primary"
          width="40rem"
          height="65px"
          textClassName="justify-center items-center text-[25px] pr-4"
        >
          {t('play_continue_offline')}
        </Button>
      )}
    </div>
  );
};

export default ModalOffLineWarning;
