/* eslint-disable @typescript-eslint/naming-convention */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { debugError, debugLog, debugWarn } from '@global/helper/debug-logger';
import { useOnlineStatus } from '@global/helper/online-status';
import { retryAsyncOperation } from '@global/helper/retry';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import { SublessonEntity, SublessonLanguageSoundType } from '../../local/type';
import API from '../api';
import { upDateDownloadLevelsFromSingleZipLink } from '../utils/lesson-download';
import { useLessonCache } from './use-lesson-cache';

interface UseSublessonCacheProps {
  sublessonId: string;
  lessonId?: string; // 🆕 Optional for backward compatibility
}

export function useSublessonCache({ sublessonId, lessonId }: UseSublessonCacheProps) {
  const online = useOnlineStatus();
  const [sublesson, setSublesson] = useState<SublessonEntity>(
    StoreSublessons.MethodGet().get(sublessonId),
  );
  const [isSublessonDownloading, setSublessonDownloading] = useState<boolean>(false);
  const [isSublessonDeleting, setSublessonDeleting] = useState<boolean>(false);
  const isSublessonInStore = sublesson !== undefined;

  // 🆕 New state for full sublesson download (not just assets)
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | undefined>();

  const [downloadFailedFiles, setDownloadFailedFiles] = useState<
    Array<{
      fileName: string;
      sublessonId: string;
      error: string;
    }>
  >([]);

  // 🔄 Force update trigger for levels changes
  const [levelsUpdateCount, setLevelsUpdateCount] = useState(0);

  // 🆕 Get lessonCache if lessonId is provided (for full sublesson download)
  const lessonCache = lessonId ? useLessonCache({ lessonId }) : null;

  // 🔒 Race condition protection - use refs instead of state checks
  const isDownloadingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const sublessonLanguageSoundPacks = useMemo(
    () => sublesson?.languages ?? {},
    [sublesson, sublesson?.languages],
  );

  // 🆕 Check download completeness
  // ✅ FIXED: Use useMemo with levelsUpdateCount AND sublesson dependency
  // This forces re-calculation when:
  // 1. StoreLevel changes (levelsUpdateCount) - levels download complete
  // 2. Sublesson changes (sublesson) - languages status updated after asset download
  // Without sublesson dependency, UI won't update when languages status changes!
  const isDownloadComplete = useMemo(() => {
    return StoreSublessons.MethodGet().isSublessonComplete(sublessonId);
  }, [sublessonId, levelsUpdateCount, sublesson]);

  const downloadState = useMemo(() => {
    return StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
  }, [sublessonId]);

  // 🆕 Cleanup stale download states on mount (e.g., after page reload)
  useEffect(() => {
    const downloadState =
      StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
    const currentSublesson = StoreSublessons.MethodGet().get(sublessonId);

    // If download state says "downloading" but no actual download is running
    // (isDownloadingRef is false), it's a stale state from before reload
    if (downloadState?.isDownloading && !isDownloadingRef.current) {
      // 🔥 IMPORTANT: Don't cleanup if download actually completed successfully
      // Check if languages data exists or progress is 100
      const hasLanguages =
        currentSublesson?.languages && Object.keys(currentSublesson.languages).length > 0;
      const isCompleted = downloadState.progress === 100;

      if (hasLanguages || isCompleted) {
        debugLog(
          `✅ Download for ${sublessonId} completed successfully, just clearing download state flag`,
        );
        // Just clear the isDownloading flag, don't reset data
        StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
        return;
      }

      debugLog(`🧹 Detected stale download state for ${sublessonId}, cleaning up...`);

      // Clear stale download state
      StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);

      // Reset to not_downloaded by clearing incomplete data
      if (currentSublesson) {
        StoreSublessons.MethodGet().update({
          ...currentSublesson,
          languages: {}, // Clear to show as not_downloaded
          levels: undefined,
          levels_by_student: undefined,
        });

        // Remove incomplete levels
        StoreLevel.MethodGet().removeLevelsForSublesson(sublessonId);

        debugLog(
          `✅ Cleaned up stale download for ${sublessonId}, ready for fresh download`,
        );
      }
    }
  }, [sublessonId]); // Run on mount and when sublessonId changes

  // Subscribe to store changes
  useEffect(() => {
    const checkState = () => {
      const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
      setSublesson(loadedSublesson);

      // 🆕 Sync download state from store
      const downloadState =
        StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
      if (downloadState) {
        setDownloadProgress(downloadState.progress);
        setDownloadError(downloadState.error);
        // ✅ Only set downloading to true if store says it's downloading
        // Don't override if we're in cleanup phase (isDownloadingRef is false)
        if (downloadState.isDownloading && isDownloadingRef.current) {
          setSublessonDownloading(true);
        } else if (!downloadState.isDownloading) {
          // If store says not downloading, respect that
          setSublessonDownloading(false);
        }
      }
    };

    checkState();
    const removeSublessonSubscription = StoreSublessons.StoreGet().subscribe(checkState);

    return () => {
      removeSublessonSubscription();
    };
  }, [sublessonId]);

  // 🔄 Subscribe to StoreLevel changes
  // CRITICAL: isSublessonComplete() checks levels from StoreLevel
  // Without this subscription, component won't re-render when levels change
  useEffect(() => {
    const handleLevelChange = () => {
      // 🔄 Force re-fetch sublesson to get latest data
      const latestSublesson = StoreSublessons.MethodGet().get(sublessonId);
      if (latestSublesson) {
        setSublesson(latestSublesson);
      }
      // Force component to re-calculate isDownloadComplete
      setLevelsUpdateCount((prev) => prev + 1);
    };

    const removeLevelSubscription = StoreLevel.StoreGet().subscribe(handleLevelChange);

    return () => {
      removeLevelSubscription();
    };
  }, [sublessonId]);

  async function downloadSublessonSounds(
    languages: SublessonLanguageSoundType | SublessonLanguageSoundType[],
  ) {
    // update the state to show downloading status
    setSublessonDownloading(true);
    // convert `languages` parameter to be an array
    const langs = Array.isArray(languages) ? languages : [languages];
    // download sound for each language
    await Promise.all([
      ...langs.map((lang) =>
        StoreSublessons.MethodGet().downloadLevelAssets(sublesson.id, lang),
      ),
      // add fake delay to let's user notice the download process
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // after downlaod, update the state
        setSublessonDownloading(false);
      });
  }

  // 🆕 ดาวน์โหลดไฟล์เสียงแยกต่างหาก (ไม่ได้รวมกับ downloadLevelAssets)
  async function downloadAudioFiles() {
    setSublessonDownloading(true);
    try {
      const audioUrls = StoreSublessons.MethodGet().getAudioUrls(sublessonId);
      if (audioUrls.length === 0) {
        debugLog(`ℹ️ No audio files to download for sublesson ${sublessonId}`);
        return;
      }

      debugLog(
        `🎵 Starting audio download for sublesson ${sublessonId} (${audioUrls.length} files)...`,
      );
      await StoreSublessons.MethodGet().downloadAudioFiles(sublessonId, audioUrls);
      debugLog(`✅ Audio download completed for sublesson ${sublessonId}`);
    } catch (err) {
      debugError(`❌ Failed to download audio files for sublesson ${sublessonId}:`, err);
    } finally {
      setSublessonDownloading(false);
    }
  }

  // 🆕 ดึงจำนวนไฟล์เสียงที่รอดาวน์โหลด
  function getAudioFilesCount(): number {
    return StoreSublessons.MethodGet().getAudioUrls(sublessonId).length;
  }

  async function deleteSublessonSounds(
    languages: SublessonLanguageSoundType | SublessonLanguageSoundType[],
  ) {
    // update the state to show delete status
    setSublessonDeleting(true);
    // convert `languages` parameter to be an array
    const langs = Array.isArray(languages) ? languages : [languages];
    // delete sound for each language
    await Promise.all([
      ...langs.map((lang) =>
        StoreSublessons.MethodGet().removeLevelAssets(sublesson.id, lang),
      ),
      // add fake delay to let's user notice the delete process
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ])
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // after delete, update the state
        setSublessonDeleting(false);
      });
  }

  // ====== 🆕 New Methods for Full Sublesson Download ======

  /**
   * Download a full sublesson (levels + questions + assets)
   * Requires lessonId to be provided in hook props
   * 🔒 Protected against race conditions with ref-based locking
   */
  const downloadSublesson = useCallback(async () => {
    if (!lessonId) {
      debugError('lessonId is required for downloadSublesson()');
      return false;
    }

    if (!lessonCache) {
      debugError('lessonCache not available');
      return false;
    }

    // 🔒 Race condition protection - check ref before proceeding
    if (isDownloadingRef.current) {
      debugLog(
        `⚠️ Sublesson ${sublessonId} is already downloading (blocked by ref lock)`,
      );
      return false;
    }

    try {
      // 🔒 Acquire lock immediately
      isDownloadingRef.current = true;
      setSublessonDownloading(true);
      setDownloadProgress(0);
      setDownloadError(undefined);

      debugLog(`📥 Starting download for sublesson ${sublessonId}...`);

      // 🆕 CRITICAL: Get download URL to extract timestamp
      // Backend appends timestamp as query parameter: ?1738339200
      let downloadUrl: string | undefined;
      try {
        const levelZipLists = await API.Level.LevelSubLessonUrl.Get(lessonId);
        if (levelZipLists.status_code === 200 && levelZipLists.data) {
          downloadUrl = levelZipLists.data[sublessonId];
          debugLog(`📥 Download URL for sublesson ${sublessonId}:`, downloadUrl);
        }
      } catch (err) {
        debugError('Failed to get download URL:', err);
      }

      // Use downloadSingleSublesson from lessonCache
      const { success, error } = await lessonCache.downloadSingleSublesson(
        sublessonId,
        downloadUrl,
      );

      if (success) {
        setDownloadProgress(100);
        setDownloadFailedFiles([]); // Clear any previous errors
        debugLog(`✅ Sublesson ${sublessonId} downloaded successfully`);

        // 🆕 CRITICAL FIX: Extract and save timestamp from URL
        // URL format: https://storage.com/file.zip?1738339200 (Unix timestamp)
        if (downloadUrl) {
          const urlObj = new URL(downloadUrl);
          const timestampParam =
            urlObj.searchParams.get('') || Array.from(urlObj.searchParams.keys())[0];
          if (timestampParam) {
            // The timestamp is the query parameter itself (no key)
            const unixTimestamp = parseInt(timestampParam, 10);
            if (!isNaN(unixTimestamp)) {
              const timestamp = new Date(unixTimestamp * 1000); // Convert Unix to Date
              StoreSublessons.MethodGet().updateSublessonUpdatedAt(
                sublessonId,
                timestamp,
              );
              debugLog(
                `⏰ Download complete - extracted and saved timestamp: ${timestamp.toISOString()}`,
              );
            } else {
              debugWarn(`⚠️ Could not parse timestamp from URL: ${timestampParam}`);
            }
          } else {
            debugWarn(`⚠️ No timestamp found in URL: ${downloadUrl}`);
          }
        }

        // Update lesson downloaded count
        if (lessonId) {
          const count = StoreLessons.MethodGet().getDownloadedSublessonCount(lessonId);
          debugLog(`📊 Lesson ${lessonId} now has ${count} downloaded sublessons`);
        }
      } else {
        // ใช้ error information ที่ได้จาก downloadSingleSublesson
        const errorMsg = error?.message || 'Download failed';
        // ใช้ชื่อบทเรียนแทนชื่อไฟล์
        const displayName = sublesson?.name || sublesson?.sub_lesson_name || error?.fileName || 'Unknown';

        setDownloadError(errorMsg);
        setDownloadFailedFiles([
          {
            fileName: displayName,
            sublessonId,
            error: errorMsg,
          },
        ]);

        debugError(`Failed to download sublesson ${sublessonId}:`, errorMsg);
        return false;
      }

      return success;
    } catch (err) {
      // จัดการ unexpected exceptions (เช่น error จาก API call ตอนดึง URL)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      // ใช้ชื่อบทเรียนแทนชื่อไฟล์
      const displayName = sublesson?.name || sublesson?.sub_lesson_name || 'Unknown';

      setDownloadError(errorMsg);
      setDownloadFailedFiles([
        {
          fileName: displayName,
          sublessonId,
          error: errorMsg,
        },
      ]);

      debugError('Unexpected error during download:', err);
      return false;
    } finally {
      // 🔒 Always release lock
      isDownloadingRef.current = false;
      setSublessonDownloading(false);
      // ✅ Clear download state in Store to prevent subscription from re-setting isDownloading
      StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
    }
  }, [sublessonId, lessonId, lessonCache]);

  /**
   * Check if sublesson has an update available (คัดลอก logic จาก use-lesson-cache)
   */
  const checkUpdate = useCallback(async (): Promise<{
    needsUpdate: boolean;
    updatedUrl?: string;
  }> => {
    try {
      if (!online || !lessonId) {
        return { needsUpdate: false };
      }

      const currentSublesson = StoreSublessons.MethodGet().get(sublessonId);
      if (!currentSublesson) {
        return { needsUpdate: false };
      }

      debugLog(`🔍 Checking update for sublesson ${sublessonId}...`);

      const subLessonCheckList = [
        {
          sub_lesson_id: currentSublesson.id,
          updated_at: currentSublesson.updated_at,
        },
      ];

      const updateResponse = await retryAsyncOperation(() =>
        API.Level.LevelSubLessonUrl.Post(lessonId, subLessonCheckList),
      );

      if (updateResponse.status_code === 200 && updateResponse.data) {
        const updatedUrls = updateResponse.data;
        const hasUpdate = Object.keys(updatedUrls).length > 0;

        if (hasUpdate) {
          const updatedUrl = updatedUrls[sublessonId];
          debugLog(`📦 Sublesson ${sublessonId} has update available`);
          return {
            needsUpdate: true,
            updatedUrl,
          };
        }
      }

      return { needsUpdate: false };
    } catch (err) {
      debugError('Failed to check sublesson update:', err);
      return { needsUpdate: false };
    }
  }, [sublessonId, lessonId, online]);

  /**
   * Process update for single sublesson (คัดลอก logic จาก use-lesson-cache)
   */
  const processUpdate = useCallback(
    async (
      zipUrl: string,
    ): Promise<{
      success: boolean;
      error?: string;
    }> => {
      if (!online || !lessonId) {
        return {
          success: false,
          error: 'offline or missing lessonId',
        };
      }

      // 🔒 Race condition protection
      if (isDownloadingRef.current) {
        debugLog(`⚠️ Sublesson ${sublessonId} is already downloading`);
        return {
          success: false,
          error: 'Download already in progress',
        };
      }

      try {
        // 🔒 Acquire lock
        isDownloadingRef.current = true;
        setSublessonDownloading(true);
        setDownloadProgress(0);
        setDownloadError(undefined);

        debugLog(`🔄 Updating sublesson ${sublessonId}...`);

        const settings = StoreGlobalPersist.MethodGet().getSettings();
        const preferredNarrativeLanguage = settings.soundLanguage;

        // ใช้ upDateDownloadLevelsFromSingleZipLink เหมือน lesson
        await retryAsyncOperation(async () => {
          await upDateDownloadLevelsFromSingleZipLink(
            zipUrl,
            preferredNarrativeLanguage,
            {
              subLessonID: sublessonId,
              lesson_id: lessonId,
            },
          );
        }, 3);

        setDownloadProgress(100);
        setDownloadFailedFiles([]); // Clear any previous errors
        debugLog(`✅ Sublesson ${sublessonId} updated successfully`);

        return { success: true };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setDownloadError(errorMsg);

        // 🆕 เก็บข้อมูล error ไว้แสดงใน error modal
        const errorFileName = zipUrl.split('/').pop()?.split('?')[0] || 'Unknown';
        setDownloadFailedFiles([
          {
            fileName: errorFileName,
            sublessonId,
            error: errorMsg,
          },
        ]);

        debugError('Failed to update sublesson:', err);
        return {
          success: false,
          error: errorMsg,
        };
      } finally {
        // 🔒 Always release lock
        isDownloadingRef.current = false;
        setSublessonDownloading(false);
        // ✅ Clear download state in Store to prevent subscription from re-setting isDownloading
        StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
      }
    },
    [sublessonId, lessonId, online],
  );

  /**
   * Delete/Reset sublesson - Reset to undownloaded state instead of removing
   * UX: Item stays in list but shows as undownloaded (download button visible)
   * 🔒 Protected against race conditions with ref-based locking
   */
  const deleteSublesson = useCallback(async () => {
    // 🔒 Race condition protection
    if (isDeletingRef.current) {
      debugLog(
        `⚠️ Sublesson ${sublessonId} is already being deleted (blocked by ref lock)`,
      );
      return false;
    }

    try {
      // 🔒 Acquire lock immediately
      isDeletingRef.current = true;
      setSublessonDeleting(true);

      debugLog(`🔄 Resetting sublesson ${sublessonId} to undownloaded state...`);

      const currentSublesson = StoreSublessons.MethodGet().get(sublessonId);
      if (!currentSublesson) {
        debugLog(`⚠️ Sublesson ${sublessonId} not found in store, nothing to delete`);
        return false;
      }

      // ✅ FIXED: Cancel any ongoing download by releasing download lock
      if (isDownloadingRef.current) {
        debugLog(`🛑 Canceling ongoing download for sublesson ${sublessonId}...`);
        isDownloadingRef.current = false;
        setSublessonDownloading(false);
      }

      // Keep metadata, clear download data
      StoreSublessons.MethodGet().update({
        ...currentSublesson,
        languages: {}, // Reset to undownloaded (empty languages = not downloaded)
        levels: undefined, // Clear levels reference
        levels_by_student: undefined, // Clear student-specific levels
      });

      // Remove levels from StoreLevel
      StoreLevel.MethodGet().removeLevelsForSublesson(sublessonId);

      // Clear download state (this clears stuck/stale download states)
      StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);

      // Wait for store updates to propagate
      await new Promise((resolve) => setTimeout(resolve, 100));

      debugLog(`✅ Sublesson ${sublessonId} reset to undownloaded state successfully`);

      // Update lesson downloaded count
      if (lessonId) {
        const count = StoreLessons.MethodGet().getDownloadedSublessonCount(lessonId);
        debugLog(`📊 Lesson ${lessonId} now has ${count} downloaded sublessons`);
      }

      return true;
    } catch (err) {
      debugError('Failed to reset sublesson:', err);
      return false;
    } finally {
      // 🔒 Always release lock
      isDeletingRef.current = false;
      setSublessonDeleting(false);
    }
  }, [sublessonId, lessonId]);

  return {
    // Legacy exports (for backward compatibility)
    sublesson,
    sublessonLanguageSoundPacks,
    isSublessonDownloading,
    isSublessonDeleting,
    isSublessonInStore,
    downloadSublessonSounds,
    deleteSublessonSounds,

    // 🆕 New exports for full sublesson download
    isDownloadComplete,
    downloadProgress,
    downloadState,
    downloadError,
    downloadSublesson,
    checkUpdate,
    processUpdate,
    deleteSublesson,

    // 🆕 Error tracking (เหมือน use-lesson-cache)
    downloadFailedFiles,
    setDownloadFailedFiles,

    // 🆕 Audio download management - สำหรับดาวน์โหลดเสียงแยกต่างหาก
    downloadAudioFiles,
    getAudioFilesCount,
  };
}
