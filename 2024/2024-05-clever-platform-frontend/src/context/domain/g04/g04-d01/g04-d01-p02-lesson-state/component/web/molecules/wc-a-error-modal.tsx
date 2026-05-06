/**
 * ❌ Error Modal
 * แสดงข้อความเมื่อเกิด error (download failed, delete failed, etc.)
 */

import { useEffect } from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  errorDetails?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export default function ErrorModal({
  isOpen,
  title = 'เกิดข้อผิดพลาด',
  message,
  errorDetails,
  onClose,
  onRetry,
}: ErrorModalProps) {
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
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
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
              <p className="text-gray-600 mb-2">{message}</p>
              {errorDetails && (
                <p className="text-sm text-gray-500 mt-2 p-3 bg-gray-100 rounded-lg">
                  {errorDetails}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3">
              {onRetry && (
                <button
                  className="bg-blue-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:bg-blue-600 outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  onClick={onRetry}
                >
                  ลองใหม่
                </button>
              )}
              <button
                className="bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:bg-gray-600 outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={onClose}
              >
                ปิด
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
