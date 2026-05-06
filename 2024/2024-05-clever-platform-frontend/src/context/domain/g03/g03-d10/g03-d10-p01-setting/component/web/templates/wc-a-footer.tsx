import { useTranslation } from 'react-i18next';

import ModalLogout from '@component/web/molecule/wc-modal-logout';
import { handleLogout } from '@global/helper/auth';
import { useClickCountTrigger } from '@global/helper/detect-press';
import StoreGlobal from '@store/global/index';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import IconFullscreen from '../../../assets/icon-full-screen.svg';
import IconGlobe from '../../../assets/icon-globe.svg';
import IconLogout from '../../../assets/icon-logout.svg';
import IconUpload from '../../../assets/icon-upload.svg';
import ConfigJson from '../../../config/index.json';
import IconButton from '../atoms/wc-a-icon-button';
import { TextNormal } from '../atoms/wc-a-text';
import IconLabelButton from '../molecules/wc-m-icon-label-button';

export function Footer({
  setShowLanguageModal,
}: {
  setShowLanguageModal: (isOpen: boolean) => void;
}) {
  const { t } = useTranslation([ConfigJson.key]);
  const { appVersion } = StoreGlobal.StateGet(['appVersion']);
  const { localAppVersion } = StoreGlobalPersist.StateGet(['localAppVersion']);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync local app version with current build when entering settings page
  useEffect(() => {
    if (localAppVersion === 'none' || localAppVersion !== appVersion) {
      StoreGlobalPersist.MethodGet().setLocalAppVersion(appVersion);
    }
  }, [appVersion, localAppVersion]);

  const handledLogout = () => {
    handleLogout();
  };
  const clickEvents = useClickCountTrigger({
    triggerCount: 7,
    onTrigger: () => {
      StoreGlobalPersist.MethodGet().setShowMemoryInfo(true);
    },
    timeout: 300,
  });

  return (
    <div className="h-20 bg-white rounded-b-[54px] flex justify-between items-center px-6">
      <div className="flex relative">
        <TextNormal className="font-normal tracking-tight">
          {t('footer_version', { version: localAppVersion })}
        </TextNormal>
        <div
          className="h-full w-10 absolute"
          onClick={clickEvents.onClick}
          onTouchEnd={clickEvents.onTouchEnd}
        />
      </div>
      <div className="flex gap-6">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
        >
          <IconButton iconSrc={IconFullscreen} width={48} height={48} />
        </div>
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => navigate({ to: '/offline-history' })}
        >
          <IconButton iconSrc={IconUpload} width={48} height={48} />
        </div>
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => setShowLanguageModal(true)}
        >
          <IconLabelButton
            width="100%"
            height="48px"
            iconSrc={IconGlobe}
            labelText={t('language')}
            seperatorClass="bg-blue-700"
          />
        </div>
        <div
          className="relative flex gap-2 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <IconLabelButton
            width="100%"
            height="48px"
            iconSrc={IconLogout}
            labelText={t('footer_logout_game')}
            seperatorClass="bg-red-700"
            variant="danger"
          />
        </div>
        <ModalLogout
          setShowModal={setIsModalOpen}
          showModal={isModalOpen}
          onOK={handledLogout}
        />
      </div>
    </div>
  );
}

export default Footer;
