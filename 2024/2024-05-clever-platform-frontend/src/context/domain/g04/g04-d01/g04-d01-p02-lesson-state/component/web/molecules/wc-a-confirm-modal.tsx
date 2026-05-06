/**
 * ⚠️ Confirm Modal
 * แสดง modal ยืนยันก่อนทำการลบหรือดำเนินการที่สำคัญ
 */

import { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title = 'ยืนยันการดำเนินการ',
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmModalProps) {
  // ♿ Accessibility: Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // 🎨 Color variants
  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-500',
      button: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-500',
      button: 'bg-yellow-500 hover:bg-yellow-600',
    },
    info: {
      icon: 'bg-blue-100 text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      {/* Modal Container */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto max-w-md mx-auto">
          <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-8">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className={`rounded-full ${styles.icon} p-4`}>
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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

            {/* Footer - Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                className="bg-gray-300 text-gray-700 font-bold uppercase text-sm px-8 py-3 rounded-full shadow hover:bg-gray-400 outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
              <button
                className={`${styles.button} text-white font-bold uppercase text-sm px-8 py-3 rounded-full shadow outline-none focus:outline-none ease-linear transition-all duration-150`}
                type="button"
                onClick={onConfirm}
              >
                {confirmLabel}
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
