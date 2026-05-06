import React, { useState } from 'react';
import Modal from '../atom/wc-a-modal';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import Button, { IButtonProps } from '@core/design-system/library/component/web/Button';

interface ModalInfoProps extends IModalInfoUI {
  open: boolean;
}

interface IModalInfoUI {
  onClose: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonVariant?: IButtonProps['variant'];
  buttonOutline?: boolean;
  buttonClassName?: string;
  onButtonClick?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ModalInfo({
  open,
  onClose,
  buttonText,
  buttonIcon,
  buttonVariant = 'dark',
  buttonOutline = false,
  buttonClassName,
  onButtonClick,
  title,
  children,
  className,
}: ModalInfoProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={cn('w-[480px] font-noto-sans-thai', className)}
      title={title}
      footer={
        <div className="flex gap-3">
          <Button
            variant={buttonVariant}
            className={cn('flex-1', buttonClassName)}
            title={buttonText ?? '...'}
            icon={buttonIcon}
            onClick={() => {
              onButtonClick && onButtonClick();
              onClose();
            }}
            outline={buttonOutline}
          />
        </div>
      }
    >
      {children}
    </Modal>
  );
}

export function useModalInfo(ui?: Partial<IModalInfoUI>): {
  Modal: () => JSX.Element;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalUI: Partial<IModalInfoUI>;
  setModalUI: React.Dispatch<React.SetStateAction<Partial<IModalInfoUI>>>;
} {
  const [open, setOpen] = useState<boolean>(false);
  const [modalUI, setModalUI] = useState<Partial<IModalInfoUI>>({
    ...ui,
  });

  const Modal: () => JSX.Element = () => (
    <ModalInfo
      {...modalUI}
      open={open}
      onClose={() => {
        modalUI?.onClose && modalUI.onClose();
        setOpen(false);
      }}
    />
  );
  return { Modal, open, setOpen, modalUI, setModalUI };
}
