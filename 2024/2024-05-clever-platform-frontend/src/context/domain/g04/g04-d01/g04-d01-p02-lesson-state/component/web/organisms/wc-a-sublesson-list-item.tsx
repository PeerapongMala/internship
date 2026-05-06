import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import { useSublessonCache } from '@domain/g04/g04-d01/local/hooks';
import { debugLog } from '@global/helper/debug-logger';
import StoreGame from '@global/store/game';
import ImageIconArrowGlyphRightWhite from '../../../assets/icon-arrow-glyph-right-white.svg';
import ImageIconDelete from '../../../assets/icon-delete.svg';
import ImageIconDownloadForOfflineWhite from '../../../assets/icon-download-for-offline-white.svg';
import ImageIconDownloadingWhite from '../../../assets/icon-downloading-white.svg';
import { StateFlow } from '../../../type';
import IconButton from '../atoms/wc-a-icon-button';
import { TextSubheader } from '../atoms/wc-a-text';
import ErrorModal from '../molecules/wc-a-error-modal';
import SuccessModal from '../molecules/wc-a-success-modal';

interface SublessonListItemProps {
  sublessonId: string;
  lessonId: string;
  index: number;
  isOnline?: boolean;
  onDownloadComplete?: () => void;
  onDeleteComplete?: () => void;
}

export default function SublessonListItem({
  sublessonId,
  lessonId,
  index,
  isOnline = true,
  onDownloadComplete,
  onDeleteComplete,
}: SublessonListItemProps) {
  const {
    sublesson,
    isSublessonInStore,
    isDownloadComplete,
    isSublessonDownloading,
    downloadProgress,
    downloadError,
    downloadSublesson,
    deleteSublesson,
  } = useSublessonCache({ sublessonId, lessonId });

  const navigate = useNavigate();
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ตรวจสอบสถานะการดาวน์โหลด
  const downloadStatus = useMemo(() => {
    if (isSublessonDownloading) return 'downloading';
    if (isDownloadComplete) return 'complete';
    if (isSublessonInStore && !isDownloadComplete) return 'partial';
    return 'not_downloaded';
  }, [isSublessonDownloading, isDownloadComplete, isSublessonInStore]);

  // // 🔍 Debug logging - ENABLED to debug download status issue
  // debugLog(`🔍 SublessonListItem ${sublessonId}:`, {
  //   sublessonId,
  //   downloadStatus,
  //   isDownloadComplete,
  //   isSublessonInStore,
  //   isSublessonDownloading,
  //   languages: sublesson?.languages,
  //   downloadProgress,
  // });

  // จัดการดาวน์โหลด
  const handleDownload = async () => {
    if (!isOnline || isSublessonDownloading) return;

    try {
      debugLog(`📥 Starting download for sublesson ${sublessonId}...`);
      const success = await downloadSublesson();

      if (success) {
        setSuccessMessage(`ดาวน์โหลดบทเรียนย่อยสำเร็จ`);
        setShowSuccessModal(true);
        onDownloadComplete?.();
      } else {
        throw new Error(downloadError || 'Download failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(`ดาวน์โหลดล้มเหลว: ${error}`);
      setShowErrorModal(true);
    }
  };

  // จัดการลบ
  const handleDelete = async () => {
    try {
      debugLog(`🗑️ Deleting sublesson ${sublessonId}...`);
      const success = await deleteSublesson();

      if (success) {
        setSuccessMessage(`ลบบทเรียนย่อยสำเร็จ`);
        setShowSuccessModal(true);
        onDeleteComplete?.();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(`ลบล้มเหลว: ${error}`);
      setShowErrorModal(true);
    }
  };

  // จัดการเข้าเล่น
  const handlePlay = async () => {
    // TODO: Navigate to play page
    debugLog(`▶️ Playing sublesson ${sublessonId}`);
    // navigate({ to: '/play/$sublessonId', params: { sublessonId } });
  };

  // Render ปุ่มตามสถานะ
  const renderActionButtons = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{downloadProgress}%</span>
            <IconButton
              iconSrc={ImageIconDownloadingWhite}
              variant="warning"
              title="กำลังดาวน์โหลด"
            />
          </div>
        );

      case 'not_downloaded':
        return (
          <IconButton
            iconSrc={ImageIconDownloadForOfflineWhite}
            variant="success"
            onClick={handleDownload}
            disabled={!isOnline}
            title="ดาวน์โหลดบทเรียนย่อยนี้"
          />
        );

      case 'partial':
        return (
          <div className="flex items-center gap-2">
            <IconButton
              iconSrc={ImageIconDownloadForOfflineWhite}
              variant="warning"
              onClick={handleDownload}
              disabled={!isOnline}
              title="ดาวน์โหลดต่อ (ไม่สมบูรณ์)"
            />
          </div>
        );

      case 'complete':
        return (
          <div className="flex items-center gap-2">
            {/* 🔍 Hide delete button when in 'ALL' tab */}
            {stateFlow !== StateFlow.ALL && (
              <IconButton
                iconSrc={ImageIconDelete}
                variant="tertiary"
                onClick={handleDelete}
                title="ลบบทเรียนย่อยนี้"
              />
            )}
            <IconButton
              iconSrc={ImageIconArrowGlyphRightWhite}
              variant="primary"
              onClick={handlePlay}
              title="เล่นบทเรียนย่อยนี้"
            />
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Index Number */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
          {index + 1}
        </div>

        {/* Sublesson Info */}
        <div className="flex-1">
          <TextSubheader className="font-medium">
            {sublesson?.name || `บทเรียนย่อยที่ ${index + 1}`}
          </TextSubheader>
          {downloadStatus === 'downloading' && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
          {downloadError && (
            <span className="text-xs text-red-500 mt-1 block">{downloadError}</span>
          )}
        </div>

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        message={errorMessage}
        errorDetails={downloadError}
        onClose={() => setShowErrorModal(false)}
        onRetry={downloadStatus !== 'complete' ? handleDownload : undefined}
      />
    </>
  );
}
