import { useParams, useNavigate } from '@tanstack/react-router';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { useLessonCache } from '@domain/g04/g04-d01/local/hooks';
import StoreLessons from '@store/global/lessons';
import StoreSublessons from '@store/global/sublessons';
import { debugLog } from '@global/helper/debug-logger';
import { TextHeader, TextSubheader } from '../atoms/wc-a-text';
import IconButton from '../atoms/wc-a-icon-button';
import SublessonListItem from '../organisms/wc-a-sublesson-list-item';
import SuccessModal from '../molecules/wc-a-success-modal';
import ErrorModal from '../molecules/wc-a-error-modal';
import CWModalUpdateLesson from '@component/web/molecule/cw-model-sublesson-update';
import ImageIconDownloadForOfflineWhite from '../../../assets/icon-download-for-offline-white.svg';
import ImageIconArrowBack from '../../../assets/icon-arrow-back.svg';

interface SublessonListPageProps {
  lessonId: string;
  isOnline?: boolean;
}

export default function SublessonListPage({
  lessonId,
  isOnline = true,
}: SublessonListPageProps) {
  const navigate = useNavigate();

  const {
    lesson,
    sublessons: sublessonsFromCache,
    downloadLessonToStore,
    syncSublessonsToStore,
    isLessonDownloading,
    downloadProgress,
  } = useLessonCache({ lessonId });

  // 🆕 Fetch sublesson metadata on mount if not available
  // This allows viewing sublessons list even when lesson is not downloaded
  useEffect(() => {
    if (!sublessonsFromCache || sublessonsFromCache.length === 0) {
      debugLog(`📋 Fetching sublesson metadata for lesson ${lessonId}...`);
      syncSublessonsToStore();
    }
  }, [lessonId, sublessonsFromCache, syncSublessonsToStore]);

  // Use sublessons from cache (fetched via syncSublessonsToStore)
  // This will work even if lesson is not downloaded
  const sublessons = sublessonsFromCache || [];

  // Count downloaded sublessons
  const downloadedCount = useMemo(() => {
    return sublessons.filter((sub: { id: string }) =>
      StoreSublessons.MethodGet().isSublessonComplete(sub.id)
    ).length;
  }, [sublessons]);

  const totalCount = sublessons.length;

  // Modal states
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync download modal with download state
  useEffect(() => {
    setShowDownloadModal(isLessonDownloading);
  }, [isLessonDownloading]);

  // Handle "Download All" button
  const handleDownloadAll = async () => {
    if (!isOnline) {
      setErrorMessage('ไม่มีการเชื่อมต่ออินเทอร์เน็ต');
      setShowErrorModal(true);
      return;
    }

    try {
      debugLog(`📥 Starting download all for lesson ${lessonId}...`);
      setShowDownloadModal(true);
      await downloadLessonToStore();
      setShowSuccessModal(true);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(`ดาวน์โหลดล้มเหลว: ${error}`);
      setShowErrorModal(true);
    } finally {
      setShowDownloadModal(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate({ to: '/lesson-state' });
  };

  // Calculate progress percentage
  const progressPercentage = totalCount > 0
    ? Math.round((downloadedCount / totalCount) * 100)
    : 0;

  // ✅ Stable callbacks to prevent infinite re-renders
  // useCallback ensures these functions have stable references
  const handleDownloadComplete = useCallback(() => {
    // No need for debugLog - callback will trigger re-render anyway
    // debugLog is disabled to prevent log spam
  }, []);

  const handleDeleteComplete = useCallback(() => {
    // No need for debugLog - callback will trigger re-render anyway
    // debugLog is disabled to prevent log spam
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconButton
            iconSrc={ImageIconArrowBack}
            variant="tertiary"
            onClick={handleBack}
            title="กลับ"
          />
          <div>
            <TextHeader>{lesson?.name || 'บทเรียน'}</TextHeader>
            <TextSubheader className="text-gray-600 mt-1">
              {downloadedCount}/{totalCount} บทเรียนย่อย
            </TextSubheader>
          </div>
        </div>

        {/* Download All Button */}
        {downloadedCount < totalCount && (
          <IconButton
            iconSrc={ImageIconDownloadForOfflineWhite}
            variant="success"
            onClick={handleDownloadAll}
            disabled={!isOnline}
            title="ดาวน์โหลดทั้งหมด"
          />
        )}
      </div>

      {/* Progress Bar */}
      {downloadedCount > 0 && downloadedCount < totalCount && (
        <div className="bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ความคืบหน้า</span>
            <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Sublesson List */}
      <div className="flex-1 overflow-y-auto bg-white m-4 rounded-lg shadow-md">
        {sublessons.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>ไม่พบบทเรียนย่อย</p>
          </div>
        ) : (
          <div>
            {sublessons.map((sublesson: { id: string }, index: number) => (
              <SublessonListItem
                key={sublesson.id}
                sublessonId={sublesson.id}
                lessonId={lessonId}
                index={index}
                isOnline={isOnline}
                onDownloadComplete={handleDownloadComplete}
                onDeleteComplete={handleDeleteComplete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Download Progress Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black opacity-70 z-40" />
      )}
      <CWModalUpdateLesson
        showModal={showDownloadModal}
        setShowModal={setShowDownloadModal}
        onConfirm={() => { }}
        mode='download'
        progress={downloadProgress.total > 0 ? Math.round((downloadProgress.completed / downloadProgress.total) * 100) : 0}
        current={downloadProgress.completed}
        total={downloadProgress.total}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="ดาวน์โหลดสำเร็จ"
        message={`ดาวน์โหลดบทเรียน "${lesson?.name}" เรียบร้อยแล้ว`}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
        onRetry={handleDownloadAll}
      />
    </div>
  );
}
