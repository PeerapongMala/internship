// src/context/global/component/web/molecule/modal/wc-m-modal/index.tsx

import { XIcon } from '@domain/g01/g01-d02/local/icon/icon';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  onOk?: () => void;
  className?: string;
  disableCancel?: boolean;
  disableOk?: boolean;
  title?: React.ReactNode;
}

const Modal = ({
  open,
  onClose,
  children,
  onOk,
  className = '',
  disableCancel,
  disableOk,
  title,
}: ModalProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={onClose ?? (() => {})}>
        <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`panel bg-slate-50 flex flex-col justify-between border-0 !p-0 rounded-lg overflow-hidden my-8 text-black dark:text-white-dark ${className}`}
              >
                <div className="flex bg-neutral-100 dark:bg-darkBox items-center justify-between px-5 py-3">
                  <h5 className="font-bold text-lg dark:text-white">{title}</h5>
                  <button type="button" onClick={onClose}>
                    <XIcon />
                  </button>
                </div>

                <div className="p-6 h-full dark:bg-dark dark:text-white">{children}</div>

                {!disableCancel || !disableOk ? (
                  <div className="flex justify-end items-center p-5">
                    {!disableCancel && (
                      <button
                        type="button"
                        className="btn btn-gray"
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
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
