import { useEffect, useState } from 'react';

import ButtonBack from '@component/web/atom/wc-a-button-back';
import styles from './index.module.css';

const Modal = ({
  title,
  setShowModal,
  customBody,
  customFooter,
  className,
  rootClassName,
  childrenClassName,
  disableClose,
}: {
  title: React.ReactNode;
  setShowModal: any;
  onOk?: any;
  customBody?: any;
  customFooter?: any;
  className?: string;
  rootClassName?: string;
  childrenClassName?: string;
  disableClose?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
    }, 300);
  };

  const handleTransitionEnd = () => {
    setIsBouncing(true);
  };

  return (
    <>
      <div
        id="modal-root"
        className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ${styles['modal-transition']} ${
          isVisible
            ? styles['transition-top-to-center-loaded']
            : styles['transition-top-to-center']
        } ${isBouncing ? styles['bounce-animation'] : ''}
          ${rootClassName}
          `}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className={`bg-white/50 rounded-[60px] p-2 pb-4 ${className}`}>
          <div
            className={`flex flex-col bg-white h-full w-full rounded-[55px] ${childrenClassName}`}
          >
            <HeaderModal
              setShowModal={handleClose}
              title={title}
              disableClose={disableClose}
            />
            {customBody}
            {customFooter}
          </div>
        </div>
      </div>
      {/* <div className="opacity-70 fixed inset-0 z-40 bg-black"></div> */}
    </>
  );
};

const HeaderModal = ({
  setShowModal,
  title,
  disableClose,
}: {
  setShowModal: any;
  title: React.ReactNode;
  disableClose?: boolean;
}) => {
  return (
    <div className="flex relative w-full justify-center border-b-2 border-dashed border-secondary py-4">
      <div className="text-3xl font-bold">{title}</div>
      {!disableClose && (
        // <img
        //   className="absolute h-8 right-11 cursor-pointer"
        //   src={ImageCancelCircle}
        //   onClick={() => setShowModal(false)}
        // />
        <ButtonBack
          id="modal_gameplay_close"
          onClick={() => setShowModal(false)}
          className="absolute w-14 h-14 left-[3rem] top-[6px] cursor-pointer"
        />
      )}
    </div>
  );
};

export default Modal;
