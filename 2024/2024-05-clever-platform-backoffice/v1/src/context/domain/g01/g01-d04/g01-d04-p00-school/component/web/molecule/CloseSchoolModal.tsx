import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX.tsx';

interface CloseSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  closeSchoolId: string;
}

const CloseSchoolModal: React.FC<CloseSchoolModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  closeSchoolId,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-start justify-center px-4">
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
                  className="my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 bg-white p-0 text-black dark:bg-black dark:text-white-dark"
                >
                  <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <div className="text-lg font-bold">ปิดโรงเรียน {closeSchoolId}</div>
                    <button
                      type="button"
                      className="text-white-dark hover:text-dark"
                      onClick={onClose}
                    >
                      <IconX />
                    </button>
                  </div>
                  <div className="p-5">
                    <p>
                      ข้อมูลจะถูกถ่ายโอนจากหน้านี้ และสำรองไว้ในฐานข้อมูล
                      คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
                    </p>

                    <div className="mt-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        รหัสผ่าน:
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-[#2b2f3a] dark:text-white"
                        placeholder="กรุณากรอกรหัสผ่าน"
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-end">
                      <button
                        type="button"
                        className="btn btn-outline-dark w-full"
                        onClick={onClose}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger w-full ltr:ml-4 rtl:mr-4"
                        onClick={onConfirm}
                      >
                        จัดเก็บข้อมูลถาวร
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default CloseSchoolModal;
