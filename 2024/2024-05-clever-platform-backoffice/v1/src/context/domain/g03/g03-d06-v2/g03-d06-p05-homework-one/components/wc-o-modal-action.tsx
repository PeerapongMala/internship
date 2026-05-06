import React from 'react';
import Modal from './wc-a-modal';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import Button, { IButtonProps } from '@core/design-system/library/component/web/Button';

interface ModalActionProps {
  open: boolean;
  onClose: () => void;
  cancelButtonText: string;
  cancelButtonIcon?: React.ReactNode;
  cancelButtonVariant?: IButtonProps['variant'];
  cancelButtonClassName?: string;
  onCancel?: () => void;
  acceptButtonText: string;
  acceptButtonIcon?: React.ReactNode;
  acceptButtonVariant?: IButtonProps['variant'];
  acceptButtonClassName?: string;
  onAccept?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

function ModalAction({
  open,
  onClose,
  cancelButtonText,
  cancelButtonIcon,
  cancelButtonVariant = 'dark',
  cancelButtonClassName,
  onCancel,
  acceptButtonText,
  acceptButtonIcon,
  acceptButtonVariant = 'primary',
  acceptButtonClassName,
  onAccept,
  title,
  children,
  className,
}: ModalActionProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={cn('w-[480px] font-noto-sans-thai', className)}
      title={title}
      footer={
        <div className="flex gap-3">
          <Button
            variant={cancelButtonVariant}
            className={cn('flex-1', cancelButtonClassName)}
            title={cancelButtonText}
            icon={cancelButtonIcon}
            onClick={() => {
              onCancel && onCancel();
              onClose();
            }}
            outline
          />
          <Button
            variant={acceptButtonVariant}
            className={cn('flex-1', acceptButtonClassName)}
            title={acceptButtonText}
            icon={acceptButtonIcon}
            onClick={() => {
              onAccept && onAccept();
              onClose();
            }}
          />
        </div>
      }
    >
      {children}
    </Modal>
  );
}

export default ModalAction;
