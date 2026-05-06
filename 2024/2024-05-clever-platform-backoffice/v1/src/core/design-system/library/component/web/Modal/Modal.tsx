import { Dialog, Transition } from '@headlessui/react';
import React, { useState, Fragment } from 'react';
import IconClose from '../../icon/IconClose';

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  children?: any;
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
    <div className={``}>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={() => onClose && onClose()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-center justify-center px-4">
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
                  as="div"
                  className={`panel my-8 flex flex-col justify-between overflow-hidden rounded-lg border-0 !p-0 text-black dark:text-white-dark ${className}`}
                >
                  <div className="flex items-center justify-between bg-neutral-100 px-5 py-3 dark:bg-[#121c2c]">
                    <h5 className="text-lg font-bold">{title}</h5>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={onClose}
                    >
                      <IconClose />
                    </button>
                  </div>
                  <div className="h-full p-6">{children}</div>
                  {!disableCancel ||
                    (!disableOk && (
                      <div className="flex items-center justify-end p-5">
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
                    ))}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
  // return (
  //     <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto" >
  //         <div className="flex items-center justify-center min-h-screen px-4">
  //             <div className={`panel flex flex-col  border-0 p-0 rounded-lg overflow-hidden my-8 text-black dark:text-white-dark ${className}`}>
  //                 <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
  //                     <h5 className="font-bold text-lg">{title}</h5>
  //                     <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
  //                         <IconX />
  //                     </button>
  //                 </div>
  //                 <div className="p-6 h-full">
  //                     {children}
  //                 </div>
  //                 {(!disableCancel || !disableOk) && (
  //                     <div className="flex justify-end items-center p-5">
  //                         {!disableCancel && (
  //                             <button type="button" className="btn btn-gray" onClick={onClose}>
  //                                 Cancel
  //                             </button>
  //                         )}
  //                         {!disableOk && (
  //                             <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={onOk}>
  //                                 Save
  //                             </button>
  //                         )}
  //                     </div>
  //                 </div>
  //             </Dialog>
  //         </Transition>
  //     </div>
  // );
};

export default Modal;
