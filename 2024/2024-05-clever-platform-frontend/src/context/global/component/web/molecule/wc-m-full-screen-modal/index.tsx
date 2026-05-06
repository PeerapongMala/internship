import { cn } from '@global/helper/cn';
import { useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowLeft from '../../../../assets/arrow-glyph-left.svg';
import FullIcon from '../../../../assets/full-screen.svg';
import Button from '../../atom/wc-a-button';
import styles from './index.module.css';

interface FullscreenModalProps {
  onClose: () => void;
  onConfirm?: () => void;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ onClose, onConfirm }) => {
  const { t, i18n } = useTranslation(['global']);
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTransitionEnd = () => {
    setIsBouncing(true);
  };

  return (
    <div
      id="modal-root"
      className={cn(
        'justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none',
        styles['modal-transition'],
        isVisible
          ? styles['transition-top-to-center-loaded']
          : styles['transition-top-to-center'],
        isBouncing && styles['bounce-animation'],
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className="font-[Noto Sans Thai] w-[732px] h-[350px] border-8 border-white bg-white/80 
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        rounded-[64px] flex flex-col items-start gap-5 shadow-[0px_4px_0px0px#dfdede,0px_8px_4px_0px_rgba(0,0,0,0.15)] inset-0 bg-cover bg-center"
      >
        <div className="flex flex-col h-full w-full gap-5">
          <div className="flex flex-col items-center justify-center w-full px-4 pb-2 border-b border-dashed border-yellow-400">
            <div className="h-16 w-16">
              <Button className="h-full w-full" variant="success">
                <img className="h-10 w-10" src={FullIcon} alt="Fullscreen icon" />
              </Button>
            </div>
            <div className="w-full text-gray-800 text-center text-4xl font-bold">
              {t('fullscreen_modal.title')}
            </div>
          </div>

          <div className="flex justify-center items-start gap-2 w-full">
            <div className="text-gray-800 text-center text-2xl tracking-tight">
              {t('fullscreen_modal.description')}
            </div>
          </div>

          <div className="flex w-full p-10 border-t border-dashed border-yellow-400">
            <Button
              className="w-full"
              variant="danger"
              onClick={handleClose}
              prefix={<img src={ArrowLeft} alt="Back arrow" className="w-10 h-10" />}
            >
              {t('fullscreen_modal.cancel')}
            </Button>
            <Button
              className="w-full ml-10"
              onClick={() => {
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen();
                }
                onConfirm?.();
                handleClose();
              }}
              prefix={<img src={FullIcon} alt="Fullscreen icon" className="w-10 h-10" />}
            >
              {t('fullscreen_modal.confirm')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
