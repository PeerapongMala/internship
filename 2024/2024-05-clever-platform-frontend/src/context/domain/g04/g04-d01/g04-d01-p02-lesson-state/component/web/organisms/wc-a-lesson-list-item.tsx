import {
  // Link, 
  useNavigate
} from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';

import { useLessonCache } from '@domain/g04/g04-d01/local/hooks';
import { debugError } from '@global/helper/debug-logger';
import StoreGame from '@global/store/game';
import StoreLevel from '@store/global/level';
import StoreSublessons from '@store/global/sublessons';
import {
  useTranslation
} from 'react-i18next';
import ImageIconArrowGlyphRightWhite from '../../../assets/icon-arrow-glyph-right-white.svg';
// import ImageIconBook from '../../../assets/icon-book.svg';
import ImageIconDownloadForOfflineWhite from '../../../assets/icon-download-for-offline-white.svg';
import ImageIconDownloadingWhite from '../../../assets/icon-downloading-white.svg';
import ImageIconTrashWhite from '../../../assets/icon-trash-white.svg';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import IconButton from '../atoms/wc-a-icon-button';
import { TextSubheader } from '../atoms/wc-a-text';

interface LessonListItemProps {
  lessonId: string;
  isOnline?: boolean;
  updateConfirmed: boolean;
  onUpdateComplete: () => void;
  activeType?: (mode: 'download' | 'update') => void;
  downloadProgressValue?: (
    total: number,
    completed: number
  ) => void;
  onShowUpdateModal?: (show: boolean) => void;
  // ⚠️ Error modal: show error with multiple failed files
  onShowErrorModal?: (
    show: boolean,
    failedFiles?: Array<{ fileName: string; sublessonId: string; error: string }>,
    successCount?: number,
    totalCount?: number
  ) => void;

  /// Delete modal handlers
  onShowDeleteConfirmModal: (show: boolean, isDownloadComplete: boolean) => void;
  lessonDeleteConfirmed: string;
  onShowDeleteLoadingModal: (show: boolean) => void; // 🆕 Loading modal callback
  onShowDeleteSuccessModal: (show: boolean) => void;
  onDeleteSuccess?: () => void;
}

function LessonListItem({
  lessonId,
  isOnline = true,
  updateConfirmed,
  onUpdateComplete,
  onShowUpdateModal,
  onShowErrorModal,
  activeType,
  downloadProgressValue,

  /// Delete modal handlers
  onShowDeleteConfirmModal,
  lessonDeleteConfirmed,
  onShowDeleteLoadingModal, // 🆕
  onShowDeleteSuccessModal,
  onDeleteSuccess,
}: LessonListItemProps) {
  const {
    lesson,
    isLessonInStore,
    isLessonDownloading,
    downloadLessonToStore,
    deleteLessonFromStore,
    isDownloadComplete,
    downloadProgress,
    downloadFailedFiles,
    setDownloadFailedFiles,
  } =
    useLessonCache({ lessonId });

  const { t } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate()
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  // ✅ Only allow play if lesson is completely downloaded
  // const canPlay = isLessonInStore && isDownloadComplete;
  const [isPlaying, setIsPlaying] = useState(false);

  // 🗑️ Delete modal states
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  // const [deletingLessonName, setDeletingLessonName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔄 Track sublessons and levels changes to force re-render
  const [sublessonsUpdateCount, setSublessonsUpdateCount] = useState(0);
  const [levelsUpdateCount, setLevelsUpdateCount] = useState(0);

  // 📡 Subscribe to StoreSublessons changes with debounce
  // 🔧 Debounce prevents excessive re-renders and memory spikes
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    const handleSublessonsChange = () => {
      // Clear previous timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set new timer - only update after 300ms of no changes
      debounceTimer = setTimeout(() => {
        setSublessonsUpdateCount((prev) => prev + 1);
      }, 300);
    };

    const unsubscribe = StoreSublessons.StoreGet().subscribe(handleSublessonsChange);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribe();
    };
  }, [lessonId]);

  // 📡 Subscribe to StoreLevel changes with debounce
  // CRITICAL: isSublessonComplete depends on levels, so we need to track level changes
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    const handleLevelChange = () => {
      // Clear previous timer
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set new timer - only update after 300ms of no changes
      debounceTimer = setTimeout(() => {
        setLevelsUpdateCount((prev) => prev + 1);
      }, 300);
    };

    const unsubscribe = StoreLevel.StoreGet().subscribe(handleLevelChange);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      unsubscribe();
    };
  }, [lessonId]);

  // 📊 Use API count for total (more reliable than store query)
  // API provides accurate total count from lesson.sub_lesson_count
  const totalCount = lesson?.sub_lesson_count ?? 0;

  // 📊 Count downloaded sublessons from store
  // 🔧 OPTIMIZED: Reduced dependencies, only re-calculate when necessary
  const downloadedCount = useMemo(() => {
    // ⚡ Early return if lesson has no sublessons
    if (totalCount === 0) {
      return 0;
    }

    const storeMethod = StoreSublessons.MethodGet();
    const sublessons = storeMethod.getFromLessonId(lessonId);

    // If no sublessons in store yet, downloaded count is 0
    if (sublessons.length === 0) {
      return 0;
    }

    // ⚡ Cache store method reference to avoid repeated calls
    // 🔧 Only log when download is active to reduce console spam
    const downloaded = sublessons.filter((sub: { id: string }) => {
      return storeMethod.isSublessonComplete(sub.id);
    }).length;

    // Log only during download or when count changes

    return downloaded;
  }, [lessonId, totalCount, sublessonsUpdateCount, levelsUpdateCount]); // 🔧 Removed isLessonInStore, isDownloadComplete

  // 📊 Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (totalCount === 0) return 0;
    return Math.round((downloadedCount / totalCount) * 100);
  }, [downloadedCount, totalCount]);


  const needsResumeDownload = isLessonInStore && !isDownloadComplete && downloadedCount > 0;

  // 🔍 Debug logging - DISABLED to prevent log spam
  // Only enable when debugging specific issues
  // debugLog(`🔍 LessonListItem ${lessonId}:`, {
  //   isLessonInStore,
  //   isDownloadComplete,
  //   canPlay,
  //   needsResumeDownload,
  //   isLessonDownloading,
  // });

  useEffect(() => {
    if (updateConfirmed) {
      onUpdateComplete();
    }
  }, [updateConfirmed]);

  useEffect(() => {
    if (lessonDeleteConfirmed === lessonId) {
      handleConfirmDelete();
    }
  }, [lessonDeleteConfirmed]);

  const handleDownload = async () => {
    if (!isOnline) return;
    activeType?.('download');
    onShowUpdateModal?.(true);
    await downloadLessonToStore();
    onShowUpdateModal?.(false);
  };

  // ✅ Fix: ใช้ useEffect แทน useMemo สำหรับ side effects
  // useEffect ทำงานหลัง render เสร็จ ไม่ระหว่าง render
  // ⚠️ ไม่ใส่ downloadProgressValue ใน deps เพื่อหลีกเลี่ยง infinite loop
  useEffect(() => {
    downloadProgressValue?.(downloadProgress.total, downloadProgress.completed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadProgress.total, downloadProgress.completed]);

  // 🆕 ตรวจสอบ download errors และแสดง error modal
  useEffect(() => {
    if (downloadFailedFiles.length > 0 && !isLessonDownloading) {
      debugError('Download completed with errors:', downloadFailedFiles);
      onShowErrorModal?.(
        true,
        downloadFailedFiles,
        downloadProgress.succeeded,
        downloadFailedFiles.length + downloadProgress.succeeded
      );
      // Clear error list after showing
      setDownloadFailedFiles([]);
    }
  }, [downloadFailedFiles, isLessonDownloading]);




  // 🗑️ Step 1: Show delete confirmation modal
  const handleDeleteButtonClick = () => {
    // เก็บชื่อก่อนลบเพื่อป้องกัน undefined
    // setDeletingLessonName(lesson?.name ?? '!');
    // setShowDeleteConfirm(true);

    onShowDeleteConfirmModal?.(true, isDownloadComplete);
  };

  // 🗑️ Step 2: Perform actual deletion after confirmation
  const handleConfirmDelete = async () => {
    if (!isLessonInStore) return;

    try {
      setIsDeleting(true);
      // เริ่ม loading state (modal ยังเปิดอยู่)
      onShowDeleteLoadingModal?.(true);

      console.log('🗑️ Deleting lesson:', lessonId);
      await deleteLessonFromStore();

      console.log('✅ Lesson deleted successfully');
      // Refresh lesson list from API
      onDeleteSuccess?.();

      // ปิด loading state และ modal confirm
      onShowDeleteLoadingModal?.(false);
      onShowDeleteConfirmModal?.(false, isDownloadComplete);

      // แสดง success modal
      onShowDeleteSuccessModal?.(true);
    } catch (error) {
      debugError('Failed to delete lesson:', error);
      onShowDeleteLoadingModal?.(false);
      onShowDeleteConfirmModal?.(false, isDownloadComplete);
      // TODO: Show error modal
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePlay = async () => {
    if (!isOnline || isPlaying) return;

    try {
      setIsPlaying(true);

      // Navigate to sublesson list
      await navigate({
        to: '/sublesson/$lessonId',
        params: { lessonId: lesson?.id },
        viewTransition: true,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const shouldDisplayWithCurrentFilter =
    stateFlow === StateFlow.ALL ||
    (stateFlow === StateFlow.DOWNLOADED && downloadedCount > 0) ||
    (stateFlow === StateFlow.UNDOWNLOADED && downloadedCount === 0);

  // 🆕 Separate View Sublessons button handler
  const handleViewSublessons = () => {
    // 🛡️ Safeguard: Ensure lesson ID exists
    if (!lesson?.id) {
      debugError('Cannot navigate: lesson ID is missing');
      return;
    }

    try {
      navigate({
        to: '/sublesson/$lessonId',
        params: { lessonId: lesson.id },
        viewTransition: true,
      });
    } catch (error) {
      debugError('Failed to navigate to sublesson list:', error);
      // Fallback: Could show error modal or toast here
    }
  };

  const renderViewSublessonButton = (
    <IconButton
      iconSrc={ImageIconArrowGlyphRightWhite}
      variant="tertiary"
      onClick={handleViewSublessons}
    // title="ดูรายการบทเรียนย่อย"
    // aria-label="ดูรายการบทเรียนย่อย"
    />
  );

  // 🎨 Render action buttons based on download state
  const renderActionButtons = useMemo(() => {
    // // 🛡️ Safeguard: Show count only when totalCount > 0
    // const shouldShowCount = totalCount > 0;

    // 🔄 Case 1: Currently downloading
    if (isLessonDownloading && isOnline) {
      return (
        <div className="flex items-center gap-2">
          {/* แสดงต่อจากชื่อบทเรียนแทน */}
          {/* {shouldShowCount && (
            <span className="text-xs text-gray-500">
              {downloadedCount}/{totalCount}
            </span>
          )} */}
          <IconButton iconSrc={ImageIconDownloadingWhite} variant="warning" isLoading />
        </div>
      );
    }

    // 📥 Case 2: Lesson not downloaded (either not in store OR has no downloaded content)
    // This covers both "never downloaded" and "deleted" states
    if (!isLessonInStore || downloadedCount === 0) {
      return (
        <>
          <IconButton
            iconSrc={ImageIconDownloadForOfflineWhite}
            variant="success"
            onClick={handleDownload}
            disabled={!isOnline}
          // title="ดาวน์โหลดบทเรียน"
          // aria-label="ดาวน์โหลดบทเรียน"
          />
          {renderViewSublessonButton}
        </>
      );
    }

    // ⚠️ Case 3: Lesson in store but incomplete (PARTIAL) - show Download, Delete, and View
    if (needsResumeDownload) {
      return (
        <>
          <div className="flex items-center gap-4">
            {/* แสดงต่อจากชื่อบทเรียนแทน */}
            {/* {shouldShowCount && (
              <span className="text-xs text-gray-500">
                {downloadedCount}/{totalCount}
              </span>
            )} */}
            <IconButton
              iconSrc={ImageIconDownloadForOfflineWhite}
              variant="warning"
              onClick={handleDownload}
              disabled={!isOnline}
            // title="ดาวน์โหลดต่อ (ไม่สมบูรณ์)"
            // aria-label="ดาวน์โหลดต่อ"
            />
            {/* 🔍 Hide delete button when in 'ALL' tab */}
            {stateFlow !== StateFlow.ALL && (
              <IconButton
                iconSrc={ImageIconTrashWhite}
                variant="danger"
                disabled={isLessonDownloading || isDeleting}
                onClick={handleDeleteButtonClick}
                isLoading={isDeleting}
              // title="ลบข้อมูลที่ดาวน์โหลดไว้"
              // aria-label="ลบข้อมูลที่ดาวน์โหลดไว้"
              />
            )}
          </div>
          <IconButton
            iconSrc={ImageIconArrowGlyphRightWhite}
            variant="tertiary"
            onClick={handleViewSublessons}
          // title="ดูรายการบทเรียนย่อย"
          // aria-label="ดูรายการบทเรียนย่อย"
          />
        </>
      );
    }

    // ✅ Case 4: Lesson complete - show Play and Delete buttons
    // 🔄 Change button variant to warning (orange) if update is available
    return (
      <>
        {/* 🔍 Hide delete button when in 'ALL' tab */}
        {stateFlow !== StateFlow.ALL && (
          <IconButton
            iconSrc={ImageIconTrashWhite}
            variant="danger"
            disabled={isLessonDownloading || isPlaying || isDeleting}
            onClick={handleDeleteButtonClick}
            isLoading={isDeleting}
          // title="ลบบทเรียน"
          // aria-label="ลบบทเรียน"
          />
        )}
        <IconButton
          iconSrc={ImageIconArrowGlyphRightWhite}
          variant="primary"
          disabled={isLessonDownloading || isPlaying}
          onClick={handlePlay}
          isLoading={isPlaying}
        // title="เล่นบทเรียน"
        // aria-label="เล่นบทเรียน"
        />
      </>
    );
  }, [isLessonDownloading, needsResumeDownload, isLessonInStore, isOnline, downloadedCount, totalCount, isPlaying, isDeleting, handleDownload, handlePlay, handleViewSublessons, handleDeleteButtonClick, lesson?.id, stateFlow]);

  // 🛡️ Hide component if:
  // 1. Filtered out by stateFlow
  // 2. Lesson data is missing
  // 3. Currently being deleted and already removed from store
  if (!shouldDisplayWithCurrentFilter || !lesson || (isDeleting && !isLessonInStore)) {
    return <></>;
  }

  return (
    <div className="flex gap-4 items-center p-4"
    // style={{
    //   backgroundColor: 'transparent',
    //   backgroundImage: isLessonDownloading
    //     ? `linear-gradient(to right, rgba(74, 222, 128, 0.2) ${progressPercentage}%, transparent ${progressPercentage}%)`
    //     : undefined,
    // }}
    >
      {/* ไม่จำเป็นต้องมีหน้าแสดงรายละเอียดบทเรียนเพราะนำปุ่มลบและจำนวนบทเรียนมาไว้ด้านนอกแล้ว */}
      {/* <Link
        to={`/lesson-info/$lessonId`}
        params={{
          lessonId: lesson?.id,
        }}
        viewTransition={true}
      >
        <IconButton iconSrc={ImageIconBook} variant="tertiary" />
      </Link> */}
      {/* <IconButton iconSrc={ImageIconBook} variant="tertiary" disabled /> */}
      <div className="flex-1 flex flex-col justify-between gap-2">
        <div className="flex  justify-between items-center">
          <TextSubheader>{lesson?.name}</TextSubheader>
          {/* 📊 Always show sublesson count badge when lesson has sublessons */}
          {/* This provides transparency: users can see total count and progress */}
          {totalCount > 0 && (
            <span className="text-xs px-2 py-1 rounded text-gray-600 bg-gray-100">
              {t('amount_of_sublesson_downloaded', { downloadedCount, totalCount })}
            </span>
          )}
        </div>

        {/* 📊 Progress bar - show only for partial downloads */}
        {/* Only show when: has sublessons, partially downloaded, safe percentage */}
        {totalCount > 0 && downloadedCount > 0 && downloadedCount < totalCount && progressPercentage > 0 && progressPercentage < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
      {renderActionButtons}

    </div>
  );
}

export default LessonListItem;
