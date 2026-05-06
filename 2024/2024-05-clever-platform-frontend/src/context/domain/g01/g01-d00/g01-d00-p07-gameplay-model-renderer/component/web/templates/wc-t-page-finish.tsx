import Button from '@component/web/atom/wc-a-button';
import Modal from '@component/web/molecule/wc-m-modal';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';

const PageFinish = ({
  onClick,
  setShowModal,
}: {
  onClick: () => void;
  setShowModal: (value: boolean) => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const handleClick = () => {
    setShowModal(false);
    onClick();
  };

  useEffect(() => {
    // StoreGame.MethodGet().GameCanvasEnableSet(false);
    // StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
  }, []);

  // Use translation keys for all text content
  const modalTitle = t('pageFinish.title', 'เกมส์จบแล้ว');
  const completionMessage = t('pageFinish.completionMessage', 'คุณเล่นด่านนี้จบแล้ว');
  const homeButtonText = t('pageFinish.homeButton', 'กลับสู่หน้าหลัก');

  return (
    <>
      <Modal
        disableClose
        setShowModal={() => { }}
        title={modalTitle}
        className="h-[25rem] w-[50rem]"
        childrenClassName=""
        customBody={
          <div className="flex flex-col items-center justify-center text-center h-full w-full gap-4 p-4">
            <p>{completionMessage}</p>
          </div>
        }
        customFooter={
          <div className="w-full h-40 flex items-center justify-center border-t-2 border-dashed border-secondary">
            <Button onClick={handleClick} variant="primary" width="30rem" height="60px">
              {homeButtonText}
            </Button>
          </div>
        }
      />
    </>
  );
};

export default PageFinish;
