import React from 'react';
import { Portal } from '@mantine/core';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  className?: string;
  disableCancel?: boolean;
  disableOk?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({
  open = false,
  onClose,
  onOk,
  className = '',
  disableCancel,
  disableOk,
  title,
  footer,
  children,
}: ModalProps) => {
  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60"
        onClick={onClose}
      />
      <div className="absolute top-0 min-h-screen w-screen">
        <div className="relative top-0 flex min-h-screen items-center justify-center px-4">
          <div
            className={`z-[1000] my-8 flex flex-col justify-between overflow-hidden rounded-lg border-0 bg-white p-0 text-black dark:text-white-dark ${className}`}
          >
            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
              <h5 className="text-lg font-bold">{title}</h5>
              <button
                type="button"
                className="text-white-dark hover:text-dark"
                onClick={onClose}
              >
                <IconX />
              </button>
            </div>
            <div className="h-full p-5">{children}</div>

            <div className="p-5 pt-0">
              {footer
                ? footer
                : (!disableCancel || !disableOk) && (
                    <div className="flex items-center justify-end">
                      {!disableCancel && (
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                      )}
                      {!disableOk && (
                        <button
                          type="button"
                          className="btn btn-primary ltr:ml-4 rtl:mr-4"
                          onClick={onOk}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
