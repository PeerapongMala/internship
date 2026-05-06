import { useEffect, useRef, useState } from 'react';

import ImageCancelCircle from '@assets/icon-cancel-circle.png';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import styles from './index.module.css';

interface ModalCommonProps {
  title: string;
  isVisible: boolean;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  customBody?: React.ReactElement;
  customFooter?: React.ReactElement;
  className?: string;
  innerClassName?: string;
  headerClassName?: string;
  onClose?: () => void;
  overlay?: boolean;
  openOnLoad?: boolean;
  closeOnClickOutside?: boolean;
  zIndex?: number;
}

/**
 * Base ModalCommon component
 * @param title - Modal title
 * @param isVisible - Modal visibility
 * @param setVisibleModal - Set modal visibility
 * @param customBody - Custom body component
 * @param customFooter - Custom footer component
 * @param className - Custom class name
 * @param innerClassName - Custom inner class name
 * @param headerClassName - Custom header class name
 * @param onClose - On close modal function
 * @param overlay - Show overlay on background
 * @param openOnLoad - Open modal on load
 * @param closeOnClickOutside - Close modal on click outside
 * @param zIndex - Modal z-index, if overlay is true, overlay z-index will be zIndex - 1
 *
 */
const ModalCommon = ({
  title,
  isVisible,
  setVisibleModal,
  customBody,
  customFooter,
  className,
  innerClassName,
  headerClassName,
  onClose,
  overlay = false,
  openOnLoad = true,
  closeOnClickOutside = true,
  zIndex = 10,
}: ModalCommonProps) => {
  const [isBouncing, setIsBouncing] = useState(false);
  const [isHidden, setIsHidden] = useState(!isVisible);
  const modalRef = useRef(null);

  useEffect(() => {
    if (openOnLoad) {
      setTimeout(() => {
        setVisibleModal(true);
      }, 10);
    }
  }, []);

  useEffect(() => {
    if (isVisible) setIsHidden(false);
  }, [isVisible]);

  const handleClose = () => {
    setVisibleModal(false);
    if (onClose) onClose();
  };

  return (
    <>
      <SafezonePanel
        style={{ zIndex: isVisible ? zIndex : -100 }}
        className={isVisible ? 'absolute top-0 left-0 w-full h-full' : ''}
      >
        <div
          id="modal-root"
          className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none ${styles['modal']}  ${isVisible
            ? styles['transition-top-to-center-loaded']
            : styles['transition-top-to-center']
            } ${isBouncing ? styles['bounce-animation'] : ''} ${isHidden ? '!z-[-100]' : ''}`}
          onTransitionEnd={(evt) => {
            if (modalRef.current === evt.target) {
              setIsBouncing(isVisible);
            }

            if (modalRef.current === evt.target && !isVisible) {
              setIsHidden(true);
            }
          }}
          ref={modalRef}
        >
          <div
            className={`bg-white/80 rounded-[60px] p-2 pb-4 ${className ?? ''}`}
          >
            <div
              className={`flex flex-col h-full w-full rounded-[55px] ${innerClassName ?? ''}`}
            >
              <HeaderModal
                onClose={handleClose}
                title={title}
                className={headerClassName}
              />
              {customBody}
              {customFooter}
            </div>
          </div>
        </div>
      </SafezonePanel>
      {overlay && (
        <div
          id="modal-overlay"
          className={`absolute inset-0 bg-black/40 top-0 left-0 w-full h-full transition-opacity duration-700 ${isVisible ? `opacity-100` : `opacity-0 z-[-100] hidden`
            }`}
          style={{ zIndex: isVisible ? zIndex - 1 : -100 }}
          onClick={(e) => {
            if (closeOnClickOutside) {
              setVisibleModal(false);
            }
          }}
        />
      )}
    </>
  );
};

const HeaderModal = ({
  onClose,
  title,
  className,
}: {
  onClose: any;
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex relative w-full justify-center bg-white rounded-t-[55px] py-4 ${className}`}
    >
      <div className="text-3xl font-bold">{title}</div>
      <img
        className="absolute h-8 right-11 cursor-pointer"
        src={ImageCancelCircle}
        onClick={() => onClose()}
      />
    </div>
  );
};

export default ModalCommon;
