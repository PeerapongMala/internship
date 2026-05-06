/**
 * ⚠️ Download Warning Modal
 * แสดงข้อความเตือนเมื่อ download ไม่สมบูรณ์ (มีไฟล์บางไฟล์โหลดไม่สำเร็จ)
 * แต่ยังสามารถเล่นบทเรียนได้ (เฉพาะกรณีที่ audio โหลดสำเร็จ แต่ images โหลดไม่สำเร็จ)
 */

import { useEffect } from 'react';
import type { FailedAsset } from '@store/global/sublessons';

interface DownloadWarningModalProps {
  isOpen: boolean;
  failedAssets: FailedAsset[];
  onContinue: () => void; // ผู้ใช้ต้องการเล่นต่อแม้ว่าจะมีไฟล์หายบ้าง
  onCancel: () => void; // ผู้ใช้ต้องการกลับไปหน้าเดิม
}

export default function DownloadWarningModal({
  isOpen,
  failedAssets,
  onContinue,
  onCancel,
}: DownloadWarningModalProps) {
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

  // แยกประเภทของ failures
  const imageFailures = failedAssets.filter((f) => f.assetType === 'image');
  const audioFailures = failedAssets.filter((f) => f.assetType === 'audio');

  // 🆕 ทุกกรณีเล่นได้ (ทั้งรูปและเสียงหายก็ยังเล่นได้)
  const canPlay = true;

  return (
    <>
      {/* Modal Container */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto max-w-2xl mx-auto">
          <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-8">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className={`rounded-full p-4 ${canPlay ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <svg
                  className={`w-16 h-16 ${canPlay ? 'text-yellow-500' : 'text-red-500'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {canPlay ? (
                    /* Warning Triangle */
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  ) : (
                    /* Error X */
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                โหลดข้อมูลไม่สมบูรณ์
              </h3>
            </div>

            {/* Body */}
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                {imageFailures.length > 0 && audioFailures.length > 0
                  ? `มีไฟล์รูปภาพ ${imageFailures.length} ไฟล์และไฟล์เสียง ${audioFailures.length} ไฟล์โหลดไม่สำเร็จ แต่คุณยังสามารถเล่นบทเรียนได้`
                  : imageFailures.length > 0
                  ? `มีไฟล์รูปภาพ ${imageFailures.length} ไฟล์โหลดไม่สำเร็จ แต่คุณยังสามารถเล่นบทเรียนได้ (อาจมีรูปภาพบางรูปแสดงไม่ได้)`
                  : `มีไฟล์เสียง ${audioFailures.length} ไฟล์โหลดไม่สำเร็จ แต่คุณยังสามารถเล่นบทเรียนได้`}
              </p>

              {/* List of failed files */}
              <div className="max-h-60 overflow-y-auto text-left">
                {imageFailures.length > 0 && (
                  <div className="mb-4">
                    <p className="font-semibold text-yellow-600 mb-2">
                      🔴 รูปภาพที่โหลดไม่สำเร็จ ({imageFailures.length} ไฟล์):
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 bg-yellow-50 p-3 rounded-lg">
                      {imageFailures.slice(0, 5).map((asset, idx) => (
                        <li key={idx} className="break-all">
                          • {asset.url.split('/').pop() || asset.url.substring(0, 50)}...
                          <br />
                          <span className="text-yellow-600 ml-3">({asset.error})</span>
                        </li>
                      ))}
                      {imageFailures.length > 5 && (
                        <li className="text-gray-500 italic">
                          และอีก {imageFailures.length - 5} ไฟล์...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {audioFailures.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-500 mb-2">
                      🟡 ไฟล์เสียงที่โหลดไม่สำเร็จ ({audioFailures.length} ไฟล์):
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                      {audioFailures.slice(0, 5).map((asset, idx) => (
                        <li key={idx} className="break-all">
                          • {asset.url.split('/').pop() || asset.url.substring(0, 50)}...
                          <br />
                          <span className="text-gray-500 ml-3">({asset.error})</span>
                        </li>
                      ))}
                      {audioFailures.length > 5 && (
                        <li className="text-gray-500 italic">
                          และอีก {audioFailures.length - 5} ไฟล์...
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3">
              <button
                className="bg-yellow-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:bg-yellow-600 outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={onContinue}
              >
                เล่นต่อ
              </button>
              <button
                className="bg-gray-500 text-white font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:bg-gray-600 outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={onCancel}
              >
                ยกเลิก
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
