/**
 * 📥 Download Progress Modal
 * แสดง progress การดาวน์โหลด sublesson พร้อม progress bar
 */

import { useEffect } from 'react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  title?: string;
  current: number;
  total: number;
  sublessonName?: string;
  onCancel?: () => void;
}

export default function DownloadProgressModal({
  isOpen,
  title = 'กำลังดาวน์โหลด',
  current,
  total,
  sublessonName,
  onCancel,
}: DownloadProgressModalProps) {
  // ♿ Accessibility: Handle Escape key (only if cancel is available)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onCancel) {
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

  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <>
      {/* Modal Container */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto max-w-md mx-auto">
          <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            </div>

            {/* Body */}
            <div className="relative flex-auto">
              {/* Sublesson Name */}
              {sublessonName && (
                <p className="text-sm text-gray-600 mb-4">
                  {sublessonName}
                </p>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Progress Text */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  {current} / {total} บทเรียนย่อย
                </span>
                <span className="font-bold text-green-600">{progress}%</span>
              </div>
            </div>

            {/* Footer */}
            {onCancel && (
              <div className="flex items-center justify-end mt-6">
                <button
                  className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150 hover:text-gray-700"
                  type="button"
                  onClick={onCancel}
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
