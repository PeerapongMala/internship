import { useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ModalChangeLanguage from '@component/web/molecule/wc-m-modal-change-language';
import ModalChangePin from '@component/web/molecule/wc-m-modal-change-pin';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useSearch } from '@tanstack/react-router';
import Dialog from './component/web/atoms/wc-a-dialog';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import MenuHeader from './component/web/templates/wc-a-menu-header';
import TabAbout from './component/web/templates/wc-a-tab-about';
import TabAccount from './component/web/templates/wc-a-tab-account';
import TabDownload from './component/web/templates/wc-a-tab-download-setting';
import TabSetting from './component/web/templates/wc-a-tab-setting';
import ModalPrivacyPolicy from './component/web/templates/wc-t-modal-policy';
import ModalTOU from './component/web/templates/wc-t-modal-tou';
import { StateFlow } from './type';

const DomainJSX = () => {
  const { tab } = useSearch({ strict: false });
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [showChangePinModal, setShowChangePinModal] = useState<boolean>(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState<boolean>(false);
  const [showTOUModal, setShowTOUModal] = useState<boolean>(false);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
    switch (tab) {
      case 'account': {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Account);
        break;
      }
      default: {
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Setting);
      }
    }
  }, []); // Make sure to provide an appropriate dependency array

  const isAnyModalOpen =
    showLanguageModal ||
    showChangePinModal ||
    showPrivacyPolicyModal ||
    showPrivacyPolicyModal ||
    showTOUModal;
  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1"
    >
      {/* Modal */}
      {isAnyModalOpen && (
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      )}
      <div
        id="main-modal"
        className={`relative inset-0 h-full w-full ${isAnyModalOpen ? 'z-50' : ''}`}
      >
        <ModalChangeLanguage
          showModal={showLanguageModal}
          setShowModal={setShowLanguageModal}
        />
        <ModalChangePin
          showModal={showChangePinModal}
          setShowModal={setShowChangePinModal}
        />
        <ModalPrivacyPolicy
          showModal={showPrivacyPolicyModal}
          setShowModal={setShowPrivacyPolicyModal}
        />
        <ModalTOU showModal={showTOUModal} setShowModal={setShowTOUModal} />
      </div>
      {/* Safezone */}
      <SafezonePanel className="flex items-center inset-0">
        <Dialog className="!gap-0">
          {/* header menu */}
          <MenuHeader />
          {stateFlow === StateFlow.Setting && (
            <TabSetting setShowLanguageModal={setShowLanguageModal} />
          )}
          {stateFlow === StateFlow.Download && (
            <TabDownload setShowLanguageModal={setShowLanguageModal} />
          )}
          {stateFlow === StateFlow.Account && (
            <TabAccount setShowChangePinModal={setShowChangePinModal} />
          )}
          {stateFlow === StateFlow.AboutUs && (
            <TabAbout
              setShowPrivacyPolicyModal={setShowPrivacyPolicyModal}
              setShowTOUModal={setShowTOUModal}
            />
          )}
        </Dialog>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
