/**
 * ✅ Success Modal
 * แสดงข้อความเมื่อดำเนินการสำเร็จ (download, delete, etc.)
 */

import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({
  isOpen,
  title = 'สำเร็จ',
  message,
  onClose,
}: SuccessModalProps) {
  // ♿ Accessibility: Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Container */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto max-w-md mx-auto">
          <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            </div>

            {/* Body */}
            <div className="text-center mb-6">
              <p className="text-gray-600">{message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center">
              <button
                className="bg-green-500 text-white font-bold uppercase text-sm px-8 py-3 rounded-full shadow hover:bg-green-600 outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={onClose}
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
