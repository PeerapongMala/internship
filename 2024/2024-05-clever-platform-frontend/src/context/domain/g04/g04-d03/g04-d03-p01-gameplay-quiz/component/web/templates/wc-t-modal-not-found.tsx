import Button from '@component/web/atom/wc-a-button';
import TextWithStroke from '@component/web/atom/wc-a-text-stroke';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useTranslation } from 'react-i18next';
import ImageIconForward from '../../../assets/icon-forward.svg';
import ImageIconHome from '../../../assets/icon-home.png';
import ConfigJson from '../../../config/index.json';

const ModalNotFound = ({
  showModal,
  setShowModal,
  onClickRefresh,
  onClickExit,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  onClickRefresh: () => void;
  onClickExit: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const title = t('modalNotFound.title', 'ไม่พบข้อมูล');
  const message = t('modalNotFound.message', 'ไม่พบข้อมูลด่าน');
  const backToLevelSelect = t('modalNotFound.backToLevelSelect', 'กลับหน้าเลือกด่าน');
  const tryAgain = t('modalNotFound.tryAgain', 'ลองอีกครั้ง');

  return (
    <>
      {showModal ? (
        <Modal
          disableClose
          setShowModal={setShowModal}
          title={title}
          className="h-[30rem] w-[50rem]"
          customBody={
            <div className="flex items-center justify-center h-full w-full">
              {message}
            </div>
          }
          customFooter={
            <div className="w-full h-40 flex items-center justify-center gap-10 border-t-2 border-dashed border-secondary">
              <Button
                variant="danger"
                width="17rem"
                height="60px"
                prefix={
                  <img
                    className="w-12 p-1"
                    src={ImageIconHome}
                    alt={t('modalNotFound.icons.home', 'ไอคอนบ้าน')}
                  />
                }
                onClick={onClickExit}
              >
                <TextWithStroke
                  text={backToLevelSelect}
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
                    alt={t('modalNotFound.icons.forward', 'ไอคอนเดินหน้า')}
                  />
                }
                onClick={onClickRefresh}
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

export default ModalNotFound;
