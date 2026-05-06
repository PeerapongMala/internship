import Button from '@component/web/atom/wc-a-button';
import TextWithStroke from '@component/web/atom/wc-a-text-stroke';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useTranslation } from 'react-i18next';
import ImageIconForward from '../../../assets/icon-forward.svg';
import ImageIconHome from '../../../assets/icon-home.png';
import ImageIconPlay from '../../../assets/icon-play.svg';
import ConfigJson from '../../../config/index.json';
import { GameConfig } from '../../../type';

const ModalTimeout = ({
  showModal,
  setShowModal,
  timerType,
  onClickPlayAgain,
  onClickPlayAgainWithNoTimer,
  onClickExit,
}: {
  showModal: boolean;
  setShowModal: any;
  timerType: GameConfig['timerType'];
  onClickPlayAgain: () => void;
  onClickPlayAgainWithNoTimer: () => void;
  onClickExit: () => void;
}) => {
  console.log('ModalTimeout', timerType);
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <>
      {timerType === 'warn' && (
        <ModalTimeoutWarn
          showModal={showModal}
          setShowModal={setShowModal}
          onClickPlayAgainWithNoTimer={onClickPlayAgainWithNoTimer}
          onClickPlayAgain={onClickPlayAgain}
        />
      )}
      {timerType === 'end' && (
        <ModalTimeoutEnd
          showModal={showModal}
          setShowModal={setShowModal}
          onClickPlayAgain={onClickPlayAgain}
          onClickExit={onClickExit}
        />
      )}
    </>
  );
};

const ModalTimeoutWarn = ({
  showModal,
  setShowModal,
  onClickPlayAgainWithNoTimer,
  onClickPlayAgain,
}: {
  showModal: boolean;
  setShowModal: any;
  onClickPlayAgainWithNoTimer?: () => void;
  onClickPlayAgain?: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  // Use translation keys for text content
  const title = t('modalTimeout.warn.title', 'หมดเวลาแล้ว');
  const message = t(
    'modalTimeout.warn.message',
    'เสียใจ เวลาหมดแล้ว คุณยังเล่นเกมนี้ต่อได้นะ',
  );
  const continueWithoutTimeLimit = t(
    'modalTimeout.warn.continueWithoutTimeLimit',
    'เล่นต่อแบบไม่จำกัดเวลา',
  );
  const playAgain = t('modalTimeout.warn.playAgain', 'เริ่มเล่นใหม่');

  return (
    <>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          title={title}
          className="h-[25rem] w-[50rem]"
          customBody={
            <div className="flex items-center justify-center h-full w-full">
              {message}
            </div>
          }
          customFooter={
            <div className="w-full h-40 flex items-center justify-center gap-4 border-t-2 border-dashed border-secondary">
              <Button
                variant="primary"
                width="23rem"
                height="60px"
                prefix={
                  <img
                    className="w-12"
                    src={ImageIconPlay}
                    alt={t('modalTimeout.icons.play', 'ไอคอนเล่น')}
                  />
                }
                onClick={onClickPlayAgainWithNoTimer}
              >
                <TextWithStroke
                  text={continueWithoutTimeLimit}
                  className="!font-semibold w-full h-full flex justify-center items-center mr-4"
                  strokeClassName="text-stroke-primary"
                />
              </Button>
              <Button
                variant="tertiary"
                width="17rem"
                height="60px"
                prefix={
                  <img
                    className="w-12 p-1"
                    src={ImageIconForward}
                    alt={t('modalTimeout.icons.forward', 'ไอคอนเดินหน้า')}
                  />
                }
                onClick={onClickPlayAgain}
              >
                <TextWithStroke
                  text={playAgain}
                  className="!font-semibold w-full h-full flex justify-center items-center"
                  strokeClassName="text-stroke-tertiary"
                />
              </Button>
            </div>
          }
        />
      ) : null}
    </>
  );
};

const ModalTimeoutEnd = ({
  showModal,
  setShowModal,
  onClickPlayAgain,
  onClickExit,
}: {
  showModal: boolean;
  setShowModal: any;
  onClickPlayAgain?: () => void;
  onClickExit?: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  // Use translation keys for text content
  const title = t('modalTimeout.end.title', 'หมดเวลาแล้ว');
  const messageSorry = t('modalTimeout.end.messageSorry', 'เสียใจ เวลาหมดแล้ว');
  const messageTryAgain = t(
    'modalTimeout.end.messageTryAgain',
    'คุณเลยไม่ผ่านด่านข้อนี้ ลองอีกครั้งสิ',
  );
  const exitGame = t('modalTimeout.end.exitGame', 'ออกจากเกม');
  const tryAgain = t('modalTimeout.end.tryAgain', 'ลองอีกครั้ง');

  return (
    <>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          title={title}
          className="h-[25rem] w-[50rem]"
          customBody={
            <div className="flex flex-col items-center justify-center gap-4 h-full w-full">
              <p>{messageSorry}</p>
              <p>{messageTryAgain}</p>
            </div>
          }
          customFooter={
            <div className="w-full h-40 flex items-center justify-center gap-4 border-t-2 border-dashed border-secondary">
              <Button
                variant="danger"
                width="17rem"
                height="60px"
                prefix={
                  <img
                    className="w-12 p-1"
                    src={ImageIconHome}
                    alt={t('modalTimeout.icons.home', 'ไอคอนบ้าน')}
                  />
                }
                onClick={onClickExit}
              >
                <TextWithStroke
                  text={exitGame}
                  className="!font-semibold w-full h-full flex justify-center items-center mr-4"
                  strokeClassName="text-stroke-danger"
                />
              </Button>
              <Button
                variant="primary"
                width="17rem"
                height="60px"
                prefix={
                  <img
                    className="w-12 p-1"
                    src={ImageIconForward}
                    alt={t('modalTimeout.icons.forward', 'ไอคอนเดินหน้า')}
                  />
                }
                onClick={onClickPlayAgain}
              >
                <TextWithStroke
                  text={tryAgain}
                  className="!font-semibold w-full h-full flex justify-center items-center"
                  strokeClassName="text-stroke-primary"
                />
              </Button>
            </div>
          }
        />
      ) : null}
    </>
  );
};

export default ModalTimeout;
