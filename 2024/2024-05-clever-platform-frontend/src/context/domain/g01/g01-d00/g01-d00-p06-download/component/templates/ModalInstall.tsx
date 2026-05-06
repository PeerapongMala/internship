import ButtonWithIcon from '@component/web/atom/wc-a-button-with-icon';
import IconButton from '@component/web/atom/wc-a-icon-button';
import Modal from '@component/web/molecule/wc-m-modal';
import ImageIconArrowLeft from '@global/assets/icon-arrow-left.svg';
import ImageIconDownload from '@global/assets/icon-download.svg';
import { useNavigate } from '@tanstack/react-router';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

interface IModalInstallProps {
  t: ReturnType<typeof useTranslation>['t'];
}

const ModalInstall = forwardRef<HTMLDivElement, IModalInstallProps>(function ModalInstall(
  { t },
  ref,
) {
  const navigate = useNavigate();

  return (
    <Modal
      className="w-3/5"
      setShowModal={undefined}
      title={
        <div className="flex flex-col items-center gap-4">
          <IconButton iconSrc={ImageIconDownload} variant="success" />
          <h1>{t('modal-install.title')}</h1>
        </div>
      }
      customBody={
        <div className="flex justify-center items-center py-10">
          <p className="text-center text-2xl break-words w-full">
            {t('modal-install.description')}
          </p>
        </div>
      }
      customFooter={
        <div className="flex gap-4 justify-around py-4 px-8 border-t-2 border-dashed border-secondary">
          <ButtonWithIcon
            className="flex-1"
            icon={ImageIconArrowLeft}
            iconPosition="left"
            iconClassName="rotate-180"
            variant="tertiary"
            onClick={() => {
              navigate({
                to: '/',
              });
            }}
          >
            {t('modal-install.continue-browser-btn')}
          </ButtonWithIcon>
          <ButtonWithIcon
            ref={ref}
            className="flex-1"
            icon={ImageIconDownload}
            iconPosition="left"
          >
            {t('modal-install.install-btn')}
          </ButtonWithIcon>
        </div>
      }
      disableClose
    />
  );
});

export default ModalInstall;
