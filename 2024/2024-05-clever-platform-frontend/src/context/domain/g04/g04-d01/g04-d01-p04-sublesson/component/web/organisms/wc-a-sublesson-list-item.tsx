import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSublessonCache } from '@domain/g04/g04-d01/local/hooks';
import { SublessonItemList } from '@domain/g04/g04-d01/local/type';
import IconReload from '@global/assets/icon-reload.svg';
import { debugLog } from '@global/helper/debug-logger';
import { useOnlineStatus } from '@global/helper/online-status';
import { SubLessonUrlDataResponse } from '@global/helper/zipDownload';
import StoreGame from '@global/store/game';
import StoreSublessons, { type FailedAsset } from '@store/global/sublessons';
import DownloadWarningModal from '../../../../g04-d01-p02-lesson-state/component/web/molecules/wc-a-download-warning-modal';
import ImageIconArrowGlyphRightWhite from '../../../assets/icon-arrow-glyph-right-white.svg';
import ImageIconDownloadForOfflineWhite from '../../../assets/icon-download-for-offline-white.svg';
import ImageIconDownloadingWhite from '../../../assets/icon-downloading-white.svg';
import ImageIconGraphicEQ from '../../../assets/icon-graphic-eq.svg';
import ImageIconTrashWhite from '../../../assets/icon-trash-white.svg';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import IconButton from '../atoms/wc-a-icon-button';
import { TextSubheader } from '../atoms/wc-a-text';

interface SubLessonListItemProps {
  lessonId: string;
  sublessonId: string;
  allSublessons: SublessonItemList[];
  onDownloadStart?: () => void;
  onDownloadProgress?: (progress: number) => void;
  onDownloadComplete?: () => void;

  /// Update modal handlers
  updateData?: SubLessonUrlDataResponse; // 🆕 Can be object with sub_lesson_id, url and new_updated_at
  hasJustUpdated?: boolean; // 🆕 Passed from parent to prevent remount issues
  onUpdateStart?: () => void;
  onUpdateProgress?: (progress: number) => void;
  onUpdateComplete?: () => void;
  onUpdateCheckComplete?: () => void; // 🆕 Callback to re-check all after update

  /// Error modal handler (เหมือน lesson pattern)
  onShowErrorModal?: (
    show: boolean,
    failedFiles?: Array<{ fileName: string; sublessonId: string; error: string }>,
    successCount?: number,
    totalCount?: number
  ) => void;

  /// Delete modal handlers
  onShowDeleteConfirmModal: (show: boolean) => void;
  sublessonDeleteConfirmed: string;
  onShowDeleteSuccessModal: (show: boolean) => void;
}

function SubLessonListItem({
  sublessonId,
  lessonId,
  allSublessons,
  onDownloadStart,
  onDownloadProgress,
  onDownloadComplete,

  /// Update modal handlers
  updateData,
  hasJustUpdated = false,
  onUpdateStart,
  onUpdateProgress,
  onUpdateComplete,
  onUpdateCheckComplete,

  /// Error modal handler
  onShowErrorModal,

  /// Delete modal handlers
  onShowDeleteConfirmModal,
  sublessonDeleteConfirmed,
  onShowDeleteSuccessModal,
}: SubLessonListItemProps) {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const online = useOnlineStatus();

  const {
    sublesson,
    isSublessonInStore,
    isDownloadComplete,
    isSublessonDownloading,
    downloadProgress,
    downloadSublesson,
    processUpdate,
    deleteSublesson,
    isSublessonDeleting,
    downloadFailedFiles,
    setDownloadFailedFiles,
  } = useSublessonCache({
    sublessonId,
    lessonId, // 🆕 Pass lessonId for download functionality
  });

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  // 📊 Track download state and notify parent
  const [previousDownloading, setPreviousDownloading] = useState(false);
  // 🆕 Warning modal for incomplete downloads
  const [showWarningModal, setShowWarningModal] = useState(false);

  // 🔄 Update state - now driven by prop instead of local check
  // has update if updateData is provided and download is complete and not just updated
  const actualUpdateUrl = updateData?.url || '';

  // 🆕 Extra safety: Ensure URL is truly non-empty and valid before showing button
  const hasValidUpdateUrl = actualUpdateUrl.trim().length > 0 && !actualUpdateUrl.includes('undefined');
  const hasUpdate = hasValidUpdateUrl && isDownloadComplete && !hasJustUpdated;

  console.log(`🔍 [SublessonListItem ${sublessonId}] Update check:`, {
    hasUpdateData: !!updateData,
    actualUpdateUrl: actualUpdateUrl ? '(exists)' : '(empty)',
    urlLength: actualUpdateUrl.length,
    hasValidUpdateUrl,
    isDownloadComplete,
    hasJustUpdated,
    finalHasUpdate: hasUpdate
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // เมื่อเริ่มดาวน์โหลด
    if (isSublessonDownloading && !previousDownloading) {
      onDownloadStart?.();
      setPreviousDownloading(true);
    }

    // เมื่อเสร็จการดาวน์โหลด
    if (!isSublessonDownloading && previousDownloading) {
      onDownloadComplete?.();
      setPreviousDownloading(false);
    }
  }, [isSublessonDownloading, previousDownloading, onDownloadStart, onDownloadComplete]);

  // 📊 Track download progress
  useEffect(() => {
    if (isSublessonDownloading && !isUpdating) {
      // Only report to onDownloadProgress if NOT updating
      onDownloadProgress?.(downloadProgress);
    }
  }, [downloadProgress, isSublessonDownloading, isUpdating, onDownloadProgress]);

  // 📊 Track update progress
  useEffect(() => {
    if (isUpdating && isSublessonDownloading) {
      // Report to onUpdateProgress during update
      onUpdateProgress?.(downloadProgress);
    }
  }, [downloadProgress, isUpdating, isSublessonDownloading, onUpdateProgress]);

  // ⚠️ Handle download errors (เหมือน lesson pattern)
  useEffect(() => {
    if (downloadFailedFiles.length > 0 && !isSublessonDownloading) {
      debugLog('Download completed with errors:', downloadFailedFiles);
      onShowErrorModal?.(
        true,
        downloadFailedFiles,
        0, // successCount
        downloadFailedFiles.length // totalCount
      );
      setDownloadFailedFiles([]);
    }
  }, [downloadFailedFiles, isSublessonDownloading, onShowErrorModal, setDownloadFailedFiles]);

  const sublessonData = useMemo(() => {
    return allSublessons.find((item) => item.id === sublessonId) || null;
  }, [allSublessons, sublessonId]);

  // 🆕 Check download status properly (checks both languages AND levels)
  const downloadStatus = useMemo(() => {
    if (isSublessonDownloading) return 'downloading';
    if (isDownloadComplete) return 'complete';

    // ✅ FIXED: Check if languages object has data to distinguish:
    // - not_downloaded: no languages data (metadata only)
    // - partial: has some languages data but not complete
    const hasLanguagesData = sublesson?.languages && Object.keys(sublesson.languages).length > 0;

    if (isSublessonInStore && hasLanguagesData && !isDownloadComplete) return 'partial';
    return 'not_downloaded';
  }, [isSublessonDownloading, isDownloadComplete, isSublessonInStore, sublesson]);

  // // 🔍 Debug logging - ENABLED to verify fix
  // debugLog(`🔍 SublessonListItem ${sublessonId}:`, {
  //   sublessonId,
  //   downloadStatus,
  //   isDownloadComplete,
  //   isSublessonInStore,
  //   isSublessonDownloading,
  //   languages: sublesson?.languages,
  //   downloadProgress,
  // });

  // Handle download
  const handleDownload = async () => {
    if (isSublessonDownloading) return;
    try {
      debugLog(`📥 Starting download for sublesson ${sublessonId}...`);
      await downloadSublesson();
    } catch (err) {
      console.error('Failed to download sublesson:', err);
    }
  };

  // 🗑️ Delete handlers
  useEffect(() => {
    if (sublessonDeleteConfirmed === sublessonId) {
      handleConfirmDelete();
    }
  }, [sublessonDeleteConfirmed]);

  const handleDeleteButtonClick = () => {
    // setShowDeleteConfirm(true);
    onShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!isSublessonInStore) return;

    try {
      // setShowDeleteConfirm(false);
      onShowDeleteConfirmModal(false);
      debugLog(`🗑️ Deleting sublesson ${sublessonId}...`);
      await deleteSublesson();
      // setShowDeleteSuccess(true);
      onShowDeleteSuccessModal(true);
    } catch (error) {
      console.error('Failed to delete sublesson:', error);
    }
  };

  // 🆕 Filter display based on stateFlow
  const shouldDisplayWithCurrentFilter =
    stateFlow === StateFlow.ALL ||
    (stateFlow === StateFlow.DOWNLOADED && isDownloadComplete) ||
    (stateFlow === StateFlow.UNDOWNLOADED && !isDownloadComplete);

  // 🆕 Render action buttons based on download status
  const renderActionButtons = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{downloadProgress}%</span>
              <IconButton
                iconSrc={ImageIconDownloadingWhite}
                variant="warning"
                isLoading={true}
                disabled={isSublessonDeleting}
                onClick={handleDownload}
              />
            </div>
            {/* Allow delete during download to cancel stuck downloads */}
            {/* <IconButton
              iconSrc={ImageIconTrashWhite}
              variant="danger"
              disabled={isSublessonDeleting}
              onClick={handleDeleteButtonClick}
              isLoading={isSublessonDeleting}
            /> */}
          </>
        );

      case 'not_downloaded':
        return (
          <>
            <IconButton
              iconSrc={ImageIconDownloadForOfflineWhite}
              variant="success"
              onClick={handleDownload}
            />
          </>
        );

      case 'partial':
        return (
          <>
            {/* 🔍 Hide delete button when in 'ALL' tab */}
            {stateFlow !== StateFlow.ALL && (
              <IconButton
                iconSrc={ImageIconTrashWhite}
                variant="danger"
                disabled={isSublessonDownloading || isSublessonDeleting}
                onClick={handleDeleteButtonClick}
                isLoading={isSublessonDeleting}
              />
            )}
            {/* ✅ FIXED: Green button for partial to indicate "continue download" */}
            <IconButton
              iconSrc={ImageIconDownloadForOfflineWhite}
              variant="success"
              onClick={handleDownload}
            />
          </>
        );

      case 'complete':
        return (
          <>
            {/* 🔍 Hide delete button when in 'ALL' tab */}
            {stateFlow !== StateFlow.ALL && (
              <IconButton
                iconSrc={ImageIconTrashWhite}
                variant="danger"
                disabled={isSublessonDownloading || isSublessonDeleting}
                onClick={handleDeleteButtonClick}
                isLoading={isSublessonDeleting}
              />
            )}
            {/* Prevent navigation to sublesson info if not downloaded */}
            <Link
              to={`/sublesson-info/$sublessonId`}
              params={{
                sublessonId: sublessonId,
              }}
              viewTransition={true}
            >
              <IconButton iconSrc={ImageIconGraphicEQ} variant="tertiary" />
            </Link>
            {/* 🔄 Show update button if update available */}
            {hasUpdate ? (
              <IconButton
                iconSrc={IconReload}
                variant="gold"
                disabled={isSublessonDownloading || isUpdating}
                onClick={async () => {
                  try {
                    setIsUpdating(true);
                    onUpdateStart?.();
                    const result = await processUpdate(actualUpdateUrl);
                    if (result.success) {
                      console.log('✅ Update successful, calling onUpdateComplete');
                      onUpdateComplete?.();

                      // 🆕 Call parent to mark as updated and re-check
                      onUpdateCheckComplete?.();
                    } else {
                      console.error('❌ Update failed:', result.error);
                    }
                  } catch (err) {
                    console.error('❌ Update error:', err);
                  } finally {
                    console.log('🔄 Update process finished, cleaning up');
                    setIsUpdating(false);
                  }
                }}
                isLoading={isSublessonDownloading || isUpdating}
              />
            ) : (
              <div
                onClick={() => {
                  // 🆕 Check for failed IMAGE downloads before playing (audio failures are skipped silently)
                  const downloadState = StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);

                  // 🔍 Debug: Log download state
                  console.log('🔍 [Sublesson List Play] Checking download state for sublesson:', sublessonId);
                  console.log('🔍 [Sublesson List Play] Download state:', downloadState);
                  console.log('🔍 [Sublesson List Play] Failed assets:', downloadState?.failedAssets);

                  const failedAssets = downloadState?.failedAssets || [];
                  const imageFailures = failedAssets.filter((f: FailedAsset) => f.assetType === 'image');
                  const audioFailures = failedAssets.filter((f: FailedAsset) => f.assetType === 'audio');

                  console.log('🔍 [Sublesson List Play] Analysis:', {
                    totalFailures: failedAssets.length,
                    imageFailures: imageFailures.length,
                    audioFailures: audioFailures.length,
                  });

                  if (imageFailures.length > 0) {
                    // Show warning modal ONLY if images failed (audio failures are ignored)
                    console.log('⚠️ Found failed image assets, showing warning modal:', imageFailures);
                    setShowWarningModal(true);
                  } else {
                    // No image issues (audio failures don't matter), navigate directly
                    console.log('✅ No image failures, navigating to lesson');
                    if (audioFailures.length > 0) {
                      console.log(`ℹ️ ${audioFailures.length} audio files failed but skipping silently`);
                    }
                    navigate({
                      to: '/level/$sublessonId',
                      params: {
                  sublessonId: sublessonId,
                      },
                      viewTransition: true,
                    });
                  }
                }}
              >
                <IconButton
                  iconSrc={ImageIconArrowGlyphRightWhite}
                  variant="primary"
                />
              </div>
            )}
          </>
        );
    }
  };

  if (!shouldDisplayWithCurrentFilter) return null;

  return (
    <div className="flex gap-4 items-center p-4">
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div className="flex justify-between items-center">
          <TextSubheader>{sublessonData?.name || sublesson?.name}</TextSubheader>
          {hasUpdate && (
            <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-medium">
              {t('sublesson_has_update')}
            </span>
          )}
        </div>
        {/* 🆕 Show progress bar when downloading */}
        {downloadStatus === 'downloading' && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}
      </div>
      {/* 🆕 Use renderActionButtons instead of statusIcon */}
      {renderActionButtons()}

      {/* 🆕 Warning Modal for Incomplete Downloads */}
      <DownloadWarningModal
        isOpen={showWarningModal}
        failedAssets={
          StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId)?.failedAssets || []
        }
        onContinue={() => {
          // User wants to play despite missing files
          console.log('✅ User chose to continue playing despite warnings');
          setShowWarningModal(false);
          navigate({
            to: '/level/$sublessonId',
            params: {
              sublessonId: sublessonId,
            },
            viewTransition: true,
          });
        }}
        onCancel={() => {
          // User canceled, stay on current page
          console.log('❌ User canceled playing');
          setShowWarningModal(false);
        }}
      />
    </div>
  );
}

export default SubLessonListItem;