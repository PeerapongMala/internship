/* eslint-disable @typescript-eslint/naming-convention */
import { useEffect, useMemo, useRef, useState } from 'react';

import { UserData } from '@domain/g02/g02-d01/local/type';
import { debugError, debugLog, debugWarn } from '@global/helper/debug-logger';
import { getDownloadConfig } from '@global/helper/download-config';
import { useOnlineStatus } from '@global/helper/online-status';
import { retryAsyncOperation } from '@global/helper/retry';
import StoreLessonFile from '@store/global/lesson-files';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import pLimit from 'p-limit';
import API from '../api';
import { LessonEntity, SublessonEntity } from '../type';
import {
  downloadLevelsFromNestedZip,
  processLevelsFromExtractedData,
  upDateDownloadLevelsFromSingleZipLink,
  verifySublessonDownloadComplete,
} from '../utils/lesson-download';

import { extractJsonFromZipUrl } from '../utils/zip-extractor';

// 🆕 Feature flag: Check if nested ZIP mode is enabled
// Default to TRUE (nested mode) unless explicitly set to "false"
const USE_NESTED_ZIP = import.meta.env.VITE_USE_NESTED_ZIP !== 'false';

// ============ Types for Smart Resume ============
type DownloadAction =
  | 'FRESH_DOWNLOAD' // Lesson not in store
  | 'RESUME_DOWNLOAD' // Partial download exists
  | 'UPDATE_DOWNLOAD' // New version available
  | 'SKIP'; // Complete and current

interface DownloadAnalysis {
  action: DownloadAction;
  reason: string;
  sublessonsToDownload?: string[];
  sublessonsComplete?: string[];
  sublessonsToUpdate?: Record<string, string>; // id -> newZipUrl
}

// ============ Smart Resume Helper ============
/**
 * Analyze what download action is needed for a lesson
 * @param lessonId - The lesson to analyze
 * @returns Analysis with recommended action and details
 */
function analyzeDownloadNeeds(lessonId: string): DownloadAnalysis {
  const lesson = StoreLessons.MethodGet().get(lessonId);
  const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);

  // Case 1: Not in store
  if (!lesson || sublessons.length === 0) {
    return {
      action: 'FRESH_DOWNLOAD',
      reason: 'Lesson not in store',
    };
  }

  // Case 2: Check download flag
  const isDownloadInProgress = StoreLessons.MethodGet().isDownloadInProgress(lessonId);
  if (isDownloadInProgress) {
    return {
      action: 'RESUME_DOWNLOAD',
      reason: 'Download flag indicates incomplete',
    };
  }

  // Case 3: Analyze sublesson statuses
  const completeSublessons: string[] = [];
  const incompleteSublessons: string[] = [];

  for (const sublesson of sublessons) {
    if (!sublesson.languages || Object.keys(sublesson.languages).length === 0) {
      incompleteSublessons.push(sublesson.id);
      continue;
    }

    const statuses = Object.values(sublesson.languages) as string[];
    const hasIncomplete = statuses.some((s) =>
      ['PARTIAL', 'UNDOWNLOADED', 'PENDING'].includes(s),
    );

    if (hasIncomplete) {
      incompleteSublessons.push(sublesson.id);
    } else if (statuses.every((s) => s === 'DOWNLOADED')) {
      completeSublessons.push(sublesson.id);
    } else {
      // Mixed or unknown - treat as incomplete
      incompleteSublessons.push(sublesson.id);
    }
  }

  // Case 4: Has incomplete sublessons
  if (incompleteSublessons.length > 0) {
    return {
      action: 'RESUME_DOWNLOAD',
      reason: `${incompleteSublessons.length} sublessons incomplete`,
      sublessonsToDownload: incompleteSublessons,
      sublessonsComplete: completeSublessons,
    };
  }

  // Case 5: All complete
  return {
    action: 'SKIP',
    reason: 'All sublessons complete',
    sublessonsComplete: completeSublessons,
  };
}

// ============ Smart Download Analysis ============
/**
 * 🎯 Analyze which sublessons need to be downloaded
 *
 * CRITICAL: This function must be called before downloading a lesson
 * to prevent redundant downloads
 *
 * @param lessonId - The lesson ID
 * @param allSublessonIds - All sublesson IDs from API
 * @returns Analysis of which sublessons to download/skip
 */
function analyzeSublessonsToDownload(
  lessonId: string,
  allSublessonIds: string[],
): {
  toDownload: string[];
  alreadyComplete: string[];
  skipped: number;
  summary: string;
} {
  const toDownload: string[] = [];
  const alreadyComplete: string[] = [];

  for (const sublessonId of allSublessonIds) {
    // Check if this sublesson is fully downloaded
    const isComplete = StoreSublessons.MethodGet().isSublessonComplete(sublessonId);

    if (isComplete) {
      // ✅ Already downloaded → skip
      alreadyComplete.push(sublessonId);
      debugLog(`✅ Sublesson ${sublessonId} already complete, skipping`);
    } else {
      // ❌ Not complete or not in store → need to download
      toDownload.push(sublessonId);

      const sublesson = StoreSublessons.MethodGet().get(sublessonId);
      if (sublesson) {
        debugLog(
          `⚠️ Sublesson ${sublessonId} incomplete (languages: ${JSON.stringify(sublesson.languages)}), will download`,
        );
      } else {
        debugLog(`📥 Sublesson ${sublessonId} not in store, will download`);
      }
    }
  }

  const summary = `Need to download ${toDownload.length}/${allSublessonIds.length} sublessons (${alreadyComplete.length} already complete)`;

  debugLog(`📊 Download Analysis:`, {
    total: allSublessonIds.length,
    toDownload: toDownload.length,
    alreadyComplete: alreadyComplete.length,
    summary,
  });

  return {
    toDownload,
    alreadyComplete,
    skipped: alreadyComplete.length,
    summary,
  };
}

interface UseLessonCacheProps {
  lessonId: string;
}

const MAX_RETRY_ATTEMPTS = 10;

export function useLessonCache({ lessonId }: UseLessonCacheProps) {
  const online = useOnlineStatus();
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lesson, setLesson] = useState<LessonEntity | undefined>(
    StoreLessons.MethodGet().get(lessonId),
  );
  const [sublessons, setSublessons] = useState<SublessonEntity[]>(
    StoreSublessons.MethodGet().getFromLessonId(lessonId),
  );
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const [isLessonDownloading, setLessonDownloading] = useState<boolean>(false);
  const [isLessonDeleting, setLessonDeleting] = useState<boolean>(false);

  const [downloadProgress, setDownloadProgress] = useState<{
    total: number;
    completed: number;
    succeeded: number; // Track successful downloads separately
  }>({ total: 0, completed: 0, succeeded: 0 });

  // 🆕 เก็บรายการไฟล์ที่ download error
  const [downloadFailedFiles, setDownloadFailedFiles] = useState<
    Array<{
      fileName: string;
      sublessonId: string;
      error: string;
    }>
  >([]);

  // 🔄 Subscribe to downloadingLessons state to detect when download completes
  const { downloadingLessons } = StoreLessons.StateGet(['downloadingLessons']);

  // 🔄 Track StoreLevel changes to update completion status
  const [levelsUpdateCount, setLevelsUpdateCount] = useState(0);

  // 📡 Subscribe to StoreLevel changes with BATCHING
  // CRITICAL: isLessonComplete depends on levels, so we need to track level changes
  // 🧠 OPTIMIZATION: Batch updates instead of debouncing to prevent missed updates
  // 🛑 PAUSE MECHANISM: Can be disabled during bulk operations to prevent subscription storm
  const levelSubscriptionPausedRef = useRef(false);

  useEffect(() => {
    let batchTimer: NodeJS.Timeout | null = null;
    let pendingUpdate = false;

    const handleLevelChange = () => {
      // 🛑 Skip if subscription is paused (during bulk delete)
      if (levelSubscriptionPausedRef.current) {
        return;
      }

      // Mark that we have a pending update
      pendingUpdate = true;

      // Only set timer if not already running
      if (!batchTimer) {
        batchTimer = setTimeout(() => {
          if (pendingUpdate) {
            debugLog(
              `🔔 StoreLevel changed, updating completion status for lesson ${lessonId}`,
            );
            setLevelsUpdateCount((prev) => prev + 1);
            pendingUpdate = false;
          }
          batchTimer = null;
        }, 1000); // Batch updates over 1 second window
      }
    };

    const removeLevelSubscription = StoreLevel.StoreGet().subscribe(handleLevelChange);

    return () => {
      if (batchTimer) clearTimeout(batchTimer);
      removeLevelSubscription();
    };
  }, [lessonId]);

  // 🔄 Calculate completion status whenever relevant state changes
  const isDownloadComplete = useMemo(() => {
    const complete = StoreLessons.MethodGet().isLessonComplete(lessonId);
    return complete;
  }, [lessonId, isLessonDownloading, downloadingLessons, levelsUpdateCount]);

  const isLessonInStore = useMemo(() => {
    return StoreLessons.MethodGet().exist(lessonId);
  }, [lessonId, isDownloadComplete, lesson]);

  // 🔄 Subscribe to StoreSublessons changes with debounce
  // CRITICAL: Without this, component won't re-render when sublessons change
  // 🔧 Debounce prevents excessive queries and memory spikes
  // 🛑 PAUSE MECHANISM: Can be disabled during bulk operations to prevent subscription storm
  const sublessonSubscriptionPausedRef = useRef(false);

  // 🔒 DELETION MUTEX: Prevent overlapping deletion operations
  // This prevents race conditions and crashes when user clicks delete multiple times
  const deletionInProgressRef = useRef(false);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    const checkSublessonsState = () => {
      const updatedSublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
      setSublessons(updatedSublessons);
    };

    // Initial check (no debounce for first load)
    checkSublessonsState();

    // Subscribe to changes with debounce
    const handleSublessonsChange = () => {
      // 🛑 Skip if subscription is paused (during bulk delete)
      if (sublessonSubscriptionPausedRef.current) {
        return;
      }

      if (debounceTimer) clearTimeout(debounceTimer);

      // Debounce: only update after 300ms of no changes
      debounceTimer = setTimeout(() => {
        checkSublessonsState();
      }, 300);
    };

    const removeSublessonSubscription =
      StoreSublessons.StoreGet().subscribe(handleSublessonsChange);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      removeSublessonSubscription();
    };
  }, [lessonId]);

  useEffect(() => {
    if (!online) {
      setShowOfflineModal(true);
      return;
    }
    const loadedLesson = StoreLessons.MethodGet().get(lessonId);

    retryAsyncOperation(() => API.Lesson.LessonById.Get(lessonId, true))
      .then((res) => {
        if (res.status_code === 200) setLesson(res.data);
      })
      .catch((error) => {
        debugError('Failed to load initial lesson after retries:', error);
        if (error.message === 'offline') {
          setShowOfflineModal(true);
        }
      });
  }, [online]);

  async function downloadLessonToStore() {
    // Step 1: Analyze what needs to be done
    const analysis = analyzeDownloadNeeds(lessonId);

    // Step 2: Handle based on action
    if (analysis.action === 'SKIP') {
      debugLog(`✅ Lesson ${lessonId} already complete, skipping`);
      return;
    }

    // ⚠️ Prevent concurrent downloads
    if (isLessonDownloading) return;

    // Step 3: Determine if fresh download or resume
    const isResume = analysis.action === 'RESUME_DOWNLOAD';

    try {
      // 🔥 Only clear URL cache for FRESH downloads
      if (!isResume) {
        StoreSublessons.MethodGet().clearDownloadedUrls(lessonId);
        debugLog(`🧹 Fresh download - cleared URL cache`);
      } else {
        debugLog(`♻️ Resume download - keeping URL cache`);
      }

      // 📝 Mark download as in progress (persisted, survives reload)
      StoreLessons.MethodGet().setDownloadInProgress(lessonId, true);

      setLessonDownloading(true);
      setRetryCount(0);

      setDownloadProgress({ total: 0, completed: 0, succeeded: 0 });

      StoreLessons.MethodGet().setLessonLoading(true);

      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        throw new Error('max retries reached');
      }
      if (!online) {
        throw new Error('offline');
      }

      const lessonResponse = await retryAsyncOperation(() =>
        API.Lesson.LessonById.Get(lessonId, true),
      );
      const levelZipLists = await retryAsyncOperation(() =>
        API.Level.LevelSubLessonUrl.Get(lessonId),
      );
      const monstersResponse = await retryAsyncOperation(() =>
        API.Lesson.LessonMonstersById.Get(lessonId),
      ); // Handle lesson data

      if (lessonResponse.status_code === 200 && lessonResponse.data) {
        StoreLessons.MethodGet().add(lessonResponse.data);
        setLesson(lessonResponse.data);
      } else {
        throw new Error('Failed to download lesson data');
      } // Handle level ZIP files

      if (levelZipLists.status_code !== 200 || !levelZipLists.data) {
        throw new Error('Failed to download sub lesson data');
      }

      const zipUrls = levelZipLists.data;
      const allSublessonIds = Object.keys(zipUrls);

      // ⭐ Step 5: Analyze which sublessons to download
      const sublessonAnalysis = analyzeSublessonsToDownload(lessonId, allSublessonIds);

      // ⭐ Step 6: If all sublessons already downloaded → skip
      if (sublessonAnalysis.toDownload.length === 0) {
        debugLog(`✅ All sublessons already downloaded, nothing to do`);
        StoreLessons.MethodGet().setDownloadInProgress(lessonId, false);
        return;
      }

      // ⭐ Step 7: Show summary
      debugLog(`📊 ${sublessonAnalysis.summary}`);
      const sublessonIdsToProcess = sublessonAnalysis.toDownload;

      setDownloadProgress({
        total: sublessonIdsToProcess.length,
        completed: 0,
        succeeded: 0,
      });

      const downloadConfig = getDownloadConfig();
      const limit = pLimit(downloadConfig.sublessonConcurrency);
      let completedCount = 0;
      let succeededCount = 0;

      // 🆕 เก็บรายการไฟล์ที่ error
      const failedFiles: Array<{
        fileName: string;
        sublessonId: string;
        error: string;
      }> = [];

      for (const sublessonId of sublessonIdsToProcess) {
        await limit(async () => {
          // ดาวน์โหลดแต่ละตัว
          const result = await downloadSingleSublesson(sublessonId, zipUrls[sublessonId]);

          completedCount++;
          if (result.success) {
            succeededCount++;
          } else {
            // เก็บข้อมูล error
            failedFiles.push({
              fileName: result.error?.fileName || 'Unknown',
              sublessonId,
              error: result.error?.message || 'Unknown error',
            });
          }

          setDownloadProgress({
            total: sublessonIdsToProcess.length,
            completed: completedCount,
            succeeded: succeededCount,
          });
          await new Promise((resolve) =>
            setTimeout(resolve, downloadConfig.sublessonDelay),
          );
        });
      }
      if (monstersResponse.status_code === 200 && monstersResponse.data) {
        StoreLessons.MethodGet().addMonsters(lessonId, monstersResponse.data);
      }

      // ⭐ Log download summary
      debugLog(`🎉 Download complete:`, {
        lessonId,
        downloaded: sublessonAnalysis.toDownload.length,
        skipped: sublessonAnalysis.skipped,
        total: allSublessonIds.length,
        succeeded: succeededCount,
        failed: failedFiles.length,
      });

      // ✅ ตรวจสอบว่ามี error หรือไม่
      if (failedFiles.length > 0) {
        debugError(
          `❌ Download completed with ${failedFiles.length}/${sublessonIdsToProcess.length} failures`,
        );
        setDownloadFailedFiles(failedFiles);
        // ไม่ throw error เพื่อให้ UI แสดง error modal แทน
        // แต่ต้อง keep download flag ไว้
        StoreLessons.MethodGet().setDownloadInProgress(lessonId, true);
      } else {
        // ✅ Check data completion (ignoring download flag to avoid logic loop)
        const isDataComplete = StoreLessons.MethodGet().isLessonDataComplete(lessonId);

        if (isDataComplete) {
          // ✅ Mark download as complete (persisted)
          debugLog(`✅ Lesson ${lessonId} data complete, clearing download flag`);
          StoreLessons.MethodGet().setDownloadInProgress(lessonId, false);
          setDownloadFailedFiles([]); // Clear error list
        } else {
          debugLog(`⚠️ Lesson ${lessonId} data incomplete, keeping download flag`);
          throw new Error('Download incomplete');
        }
      }

      setDownloadProgress((prev) => ({
        total: prev.completed,
        completed: prev.completed,
        succeeded: prev.succeeded,
      }));
    } catch (error) {
      debugError('Download failed:', error);

      setLessonDownloading(false);

      StoreLessons.MethodGet().setLessonLoading(false);

      if (
        (error instanceof Error &&
          (error.message === 'network_error' ||
            error.message === 'offline' ||
            error.message.includes('zip file'))) ||
        retryCount >= MAX_RETRY_ATTEMPTS
      ) {
        await clearFailedDownload();
        setShowOfflineModal(true);
      } else {
        setRetryCount((prev) => prev + 1);
      }
    } finally {
      setLessonDownloading(false);
      StoreLessons.MethodGet().setLessonLoading(false);
      // 🧹 Clean up download cache after lesson download completes (success or failure)
      StoreSublessons.MethodGet().clearDownloadedUrls(lessonId);
    }
  }

  async function downloadSingleSublesson(
    sublessonId: string,
    zipUrl?: string,
  ): Promise<{
    success: boolean;
    error?: {
      message: string;
      fileName: string;
    };
  }> {
    // ตรวจสอบว่า sublesson นี้กำลังโหลดอยู่หรือไม่
    // const downloadState =
    //   StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
    // if (downloadState?.isDownloading) {
    //   return {
    //     success: false,
    //     error: {
    //       message: 'Download already in progress',
    //       fileName: 'Unknown',
    //     },
    //   };
    // }

    // ตรวจสอบว่าดาวน์โหลดครบแล้วหรือไม่
    const isAlreadyComplete =
      StoreSublessons.MethodGet().isSublessonComplete(sublessonId);
    if (isAlreadyComplete) {
      return { success: true };
    }

    try {
      // 🆕 Set download state to downloading
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isDownloading: true,
        progress: 0,
        startTime: Date.now(),
        error: null,
      });
      StoreLessons.MethodGet().setSublessonDownloadInProgress(
        sublessonId,
        lessonId,
        true,
        0,
      );

      // ตรวจสอบ online status
      if (!online) {
        throw new Error('offline');
      }

      let finalZipUrl = zipUrl;
      if (!finalZipUrl) {
        const levelZipLists = await retryAsyncOperation(() =>
          API.Level.LevelSubLessonUrl.Get(lessonId),
        );
        if (levelZipLists.status_code !== 200 || !levelZipLists.data) {
          throw new Error('Failed to fetch sub lesson URL');
        }
        finalZipUrl = levelZipLists.data[sublessonId];
      }

      if (!finalZipUrl) {
        throw new Error(`No ZIP URL for sublesson ${sublessonId}`);
      }

      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isDownloading: true,
        progress: 30,
        startTime: Date.now(),
        error: null,
      });
      StoreLessons.MethodGet().setSublessonDownloadInProgress(
        sublessonId,
        lessonId,
        true,
        30,
      );

      // 🔥 AGGRESSIVE PRE-DOWNLOAD MEMORY CLEANUP

      // Force multiple GC cycles
      if (typeof (globalThis as any).gc === 'function') {
        for (let i = 0; i < 3; i++) {
          (globalThis as any).gc();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 🔍 MEMORY DEBUG: Track before extraction
      const memBefore = (performance as any).memory?.usedJSHeapSize || 0;
      console.log(`📊 Memory BEFORE extract: ${(memBefore / 1024 / 1024).toFixed(2)}MB`);

      // 🚨 MOBILE WARNING: Check if memory is still too high
      const MEMORY_WARNING_THRESHOLD_MB = 100; // ลดจาก 150 → 100 MB
      const MEMORY_CRITICAL_THRESHOLD_MB = 200; // เพิ่ม critical threshold

      if (memBefore / 1024 / 1024 > MEMORY_CRITICAL_THRESHOLD_MB) {
        console.error(
          `❌ CRITICAL MEMORY: ${(memBefore / 1024 / 1024).toFixed(2)}MB - Aborting download to prevent crash!`,
        );
      } else if (memBefore / 1024 / 1024 > MEMORY_WARNING_THRESHOLD_MB) {
        console.warn(
          `⚠️ HIGH MEMORY WARNING: ${(memBefore / 1024 / 1024).toFixed(2)}MB before download! Proceeding with caution...`,
        );
      } else {
        console.log(`✅ Memory OK: ${(memBefore / 1024 / 1024).toFixed(2)}MB`);
      }

      const settings = StoreGlobalPersist.MethodGet().getSettings();
      const preferredNarrativeLanguage = settings.soundLanguage;

      // 🆕 Choose extraction method based on feature flag
      if (USE_NESTED_ZIP) {
        // ✨ NEW: Nested ZIP structure
        console.log('📦 Using NESTED ZIP extraction mode');

        StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
          isDownloading: true,
          progress: 60,
          startTime: Date.now(),
          error: null,
        });
        StoreLessons.MethodGet().setSublessonDownloadInProgress(
          sublessonId,
          lessonId,
          true,
          60,
        );

        await downloadLevelsFromNestedZip(
          finalZipUrl,
          preferredNarrativeLanguage,
          {
            subLessonID: sublessonId,
            lesson_id: lessonId,
          },
          (levelProgress) => {},
        );
      } else {
        // 📦 LEGACY: Single ZIP extraction

        const extractResult = await extractJsonFromZipUrl(finalZipUrl);
        let { jsonData, assets }: { jsonData: any; assets: Map<string, Blob> | null } =
          extractResult; // 🔥 Use let for cleanup with nullable type

        // 🔍 MEMORY DEBUG: Track after extraction
        const memAfterExtract = (performance as any).memory?.usedJSHeapSize || 0;
        console.log(
          `📊 Memory AFTER extract: ${(memAfterExtract / 1024 / 1024).toFixed(2)}MB`,
        );
        console.log(
          `📊 Memory INCREASE: ${((memAfterExtract - memBefore) / 1024 / 1024).toFixed(2)}MB`,
        );
        console.log(
          `📊 jsonData size estimate: ${(JSON.stringify(jsonData).length / 1024 / 1024).toFixed(2)}MB`,
        );
        console.log(`📊 assets count: ${assets?.size || 0}`);

        StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
          isDownloading: true,
          progress: 60,
          startTime: Date.now(),
          error: null,
        });
        StoreLessons.MethodGet().setSublessonDownloadInProgress(
          sublessonId,
          lessonId,
          true,
          60,
        );

        // 🔍 MEMORY DEBUG: Track before processing
        const memBeforeProcess = (performance as any).memory?.usedJSHeapSize || 0;
        console.log(
          `📊 Memory BEFORE process: ${(memBeforeProcess / 1024 / 1024).toFixed(2)}MB`,
        );

        await processLevelsFromExtractedData(
          jsonData,
          preferredNarrativeLanguage,
          {
            subLessonID: sublessonId,
            lesson_id: lessonId,
          },
          (levelProgress) => {},
          assets,
        );

        // 🔍 MEMORY DEBUG: Track after processing
        const memAfterProcess = (performance as any).memory?.usedJSHeapSize || 0;
        console.log(
          `📊 Memory AFTER process: ${(memAfterProcess / 1024 / 1024).toFixed(2)}MB`,
        );
        console.log(
          `📊 Memory INCREASE from process: ${((memAfterProcess - memBeforeProcess) / 1024 / 1024).toFixed(2)}MB`,
        );

        // 🔥 Note: Assets cleanup is now handled inside processLevelsFromExtractedData
        // to allow reuse across multiple levels (prevents re-downloading)
        assets = null; // Just null the reference
        jsonData = null;
        console.log('🧹 Cleared jsonData and assets references from main thread');
      }

      // 🔍 MEMORY DEBUG: Track after cleanup
      const memAfterCleanup = (performance as any).memory?.usedJSHeapSize || 0;
      console.log(
        `📊 Memory AFTER cleanup: ${(memAfterCleanup / 1024 / 1024).toFixed(2)}MB`,
      );

      // 🔥 CRITICAL: Force garbage collection on mobile (if available)
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
        console.log('🧹 Forced garbage collection');
      } else {
        console.log('⚠️ GC not available (run with --expose-gc in dev)');
      }

      // 🔥 Add delay to let GC work
      await new Promise((resolve) => setTimeout(resolve, 100));

      // ✅ Step 4: Comprehensive Verification
      console.log(`✅ Verifying sublesson ${sublessonId} completion...`);
      const verification = verifySublessonDownloadComplete(sublessonId);

      if (!verification.isComplete) {
        const issuesText = verification.details.issues.join(', ');
        console.error(`❌ Verification failed for ${sublessonId}:`, verification.details);
        throw new Error(`Sublesson ${sublessonId} download incomplete: ${issuesText}`);
      }

      console.log(`✅ Verification passed:`, {
        levels: verification.details.levelCount,
        questions: verification.details.questionCount,
      });

      // 🎉 Success - Clear download state (but keep failedAssets for warning modal)
      const currentState =
        StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isDownloading: false,
        progress: 100,
        startTime: Date.now(),
        error: null,
        failedAssets: currentState?.failedAssets, // 🆕 Preserve failed assets for modal
      });
      StoreLessons.MethodGet().setSublessonDownloadInProgress(
        sublessonId,
        lessonId,
        false,
        100,
      );

      console.log(`✅ Successfully downloaded sublesson ${sublessonId}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to download sublesson ${sublessonId}:`, error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorFileName = zipUrl?.split('/').pop() || 'Unknown';

      // 🆕 Set error state
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isDownloading: false,
        progress: 0,
        startTime: Date.now(),
        error: errorMessage,
      });
      StoreLessons.MethodGet().setSublessonDownloadInProgress(
        sublessonId,
        lessonId,
        false,
        0,
      );

      // 🔥 CRITICAL FIX: Don't delete metadata! Keep sublesson data to prevent count mismatch
      // Only clear incomplete download content to allow retry
      if (StoreSublessons.MethodGet().exist(sublessonId)) {
        const sublesson = StoreSublessons.MethodGet().get(sublessonId);
        if (sublesson) {
          console.log(
            `⚠️ Download failed for sublesson ${sublessonId}, clearing incomplete content (keeping metadata)`,
          );

          // Preserve metadata, clear only download content
          StoreSublessons.MethodGet().update({
            ...sublesson,
            // Clear incomplete download data
            languages: {}, // Reset to empty (marks as not downloaded)
            levels: undefined, // Clear incomplete levels
            levels_by_student: undefined,
          });
        }
      }

      if (error instanceof Error && error.message === 'offline') {
        setShowOfflineModal(true);
      }

      return {
        success: false,
        error: {
          message: errorMessage,
          fileName: errorFileName,
        },
      };
    }
  }

  async function clearFailedDownload(removeMetadata = true) {
    try {
      // 🧹 Clear download cache before cleanup
      StoreSublessons.MethodGet().clearDownloadedUrls(lessonId);

      //  ลบบทเรียนหลัก
      if (StoreLessons.MethodGet().exist(lessonId)) {
        StoreLessons.MethodGet().remove(lessonId);
      } // ลบ sublessons

      const relatedSublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
      for (const sublesson of relatedSublessons) {
        StoreSublessons.MethodGet().remove(sublesson.id);
      }

      StoreLessons.MethodGet().removeMonsters(lessonId);

      setLesson(undefined);
      setSublessons([]);

      debugLog(`✅ Cleanup completed for lesson ${lessonId}`);
    } catch (error) {
      debugError('❌ Failed to clear failed download data:', error);
    }
  }
  async function checkUpdate() {
    try {
      if (!online) {
        throw new Error('offline');
      } // sublessons ปัจจุบันของ store

      const currentSublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);

      const subLessonCheckList = currentSublessons.map((sub: any) => ({
        sub_lesson_id: sub.id,
        updated_at: sub.updated_at,
      }));
      if (subLessonCheckList.length === 0) {
        return {
          needsUpdate: false,
          updatedUrls: {},
        };
      }

      const updateResponse = await retryAsyncOperation(() =>
        API.Level.LevelSubLessonUrl.Post(lessonId, subLessonCheckList),
      );

      if (updateResponse.status_code === 200 && updateResponse.data) {
        const updatedUrls = updateResponse.data;
        const hasUpdates = Object.keys(updatedUrls).length > 0;

        if (hasUpdates) {
          return {
            needsUpdate: true,
            updatedUrls,
          };
        }
      }

      return {
        needsUpdate: false,
        updatedUrls: {},
      };
    } catch (error) {
      debugError('Failed to check update:', error);
      return {
        needsUpdate: false,
        updatedUrls: {},
      };
    }
  }
  async function processUpdateUrls(urls: Record<string, string>): Promise<{
    success: boolean;
    failedFiles?: Array<{
      fileName: string;
      sublessonId: string;
      error: string;
    }>;
    totalProcessed?: number;
    successCount?: number;
  }> {
    if (!online) {
      return {
        success: false,
        failedFiles: [
          {
            fileName: 'Unknown',
            sublessonId: 'Unknown',
            error: 'offline',
          },
        ],
      };
    }
    if (isLessonDownloading) {
      return {
        success: false,
        failedFiles: [
          {
            fileName: 'Unknown',
            sublessonId: 'Unknown',
            error: 'Download already in progress',
          },
        ],
      };
    }

    const settings = StoreGlobalPersist.MethodGet().getSettings();
    const preferredNarrativeLanguage = settings.soundLanguage;

    try {
      setLessonDownloading(true);
      setDownloadProgress({ total: 0, completed: 0, succeeded: 0 });
      const entries = Object.entries(urls);
      const total = entries.length;
      let completed = 0;
      let succeeded = 0;

      // 🆕 เก็บรายการไฟล์ที่ error
      const failedFiles: Array<{
        fileName: string;
        sublessonId: string;
        error: string;
      }> = [];

      setDownloadProgress({ total, completed, succeeded });

      // 🔄 พยายาม update ทุกไฟล์ แม้บางไฟล์จะ error
      for (const [sublessonId, zipUrl] of entries) {
        try {
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
          completed++;
          succeeded++;
          setDownloadProgress({ total, completed, succeeded });
        } catch (error) {
          debugError(`Failed to update sublesson ${sublessonId}:`, error);
          completed++;
          setDownloadProgress({ total, completed, succeeded });

          // เก็บข้อมูล error ไว้แต่ไม่ return ทันที
          const errorFileName = zipUrl.split('/').pop() || zipUrl;
          const errorMessage = error instanceof Error ? error.message : String(error);

          failedFiles.push({
            fileName: errorFileName,
            sublessonId,
            error: errorMessage,
          });

          debugLog(
            `⚠️ Failed to update ${errorFileName}, continuing with remaining files...`,
          );
        }
      }

      // ✅ ตรวจสอบผลลัพธ์ทั้งหมด
      if (failedFiles.length > 0) {
        debugError(`❌ Update completed with ${failedFiles.length}/${total} failures`);
        return {
          success: false,
          failedFiles,
          totalProcessed: total,
          successCount: succeeded,
        };
      }

      debugLog(`✅ All ${total} files updated successfully`);
      return {
        success: true,
        totalProcessed: total,
        successCount: succeeded,
      };
    } catch (error) {
      debugError('Failed to process updates:', error);
      return {
        success: false,
        failedFiles: [
          {
            fileName: 'Unknown',
            sublessonId: 'Unknown',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      };
    } finally {
      setLessonDownloading(false);
      setDownloadProgress({ total: 0, completed: 0, succeeded: 0 });
    }
  }
  async function syncSublessonsToStore() {
    // 🔒 Simple guard to prevent multiple simultaneous calls
    // Don't use isLessonDownloading flag as it hides UI in old component
    try {
      debugLog(`📋 Fetching sublesson metadata for lesson ${lessonId}...`);

      const [sublessonsAllResponse] = await Promise.all([
        retryAsyncOperation(() => API.Sublesson.SublessonAll.Get(lessonId, true)),
      ]);

      const sublessonsValid = sublessonsAllResponse.status_code === 200;

      // if sublessons found, store it to sublesson store
      if (sublessonsValid && sublessonsAllResponse.data) {
        const sublessonsFromAPI = sublessonsAllResponse.data;
        debugLog(`✅ Fetched ${sublessonsFromAPI.length} sublessons from API`);

        // 🆕 Use API data directly and add to store (metadata only, not content)
        // This allows viewing sublessons before downloading
        for (const sublessonMetadata of sublessonsFromAPI) {
          // Check if already exists in store
          const existingSublesson = StoreSublessons.MethodGet().get(sublessonMetadata.id);

          debugLog(`🔍 Processing sublesson ${sublessonMetadata.id}:`, {
            hasLessonId: !!sublessonMetadata.lesson_id,
            lesson_id: sublessonMetadata.lesson_id,
            expectedLessonId: lessonId,
            existsInStore: !!existingSublesson,
            existingLessonId: existingSublesson?.lesson_id,
          });

          if (!existingSublesson) {
            // Add metadata to store (without download status)
            // This creates a "placeholder" that shows the sublesson exists but not downloaded
            // 🔥 CRITICAL: Ensure lesson_id is set correctly
            StoreSublessons.MethodGet().add({
              ...sublessonMetadata,
              lesson_id: lessonId, // 🆕 FORCE correct lesson_id
              languages: {}, // Empty = not downloaded
            } as SublessonEntity);
            debugLog(
              `📝 Added metadata for sublesson ${sublessonMetadata.id} with lesson_id=${lessonId}`,
            );
          } else {
            // 🆕 Update lesson_id if it doesn't match
            if (existingSublesson.lesson_id !== lessonId) {
              debugLog(
                `⚠️ Fixing lesson_id for sublesson ${sublessonMetadata.id}: ${existingSublesson.lesson_id} → ${lessonId}`,
              );
              StoreSublessons.MethodGet().update({
                ...existingSublesson,
                lesson_id: lessonId,
              });
            } else {
              debugLog(
                `✓ Sublesson ${sublessonMetadata.id} already in store with correct lesson_id`,
              );
            }
          }
        }

        // Get all sublessons from store (includes both downloaded and metadata-only)
        const allSublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
        debugLog(`📊 Total sublessons in store: ${allSublessons.length}`);

        setSublessons(allSublessons);
      }
    } catch (error) {
      debugError('Failed to fetch sublesson metadata:', error);
    }
  }

  async function deleteLessonFromStore() {
    // 🔒 MUTEX CHECK: Prevent overlapping deletions
    if (deletionInProgressRef.current) {
      console.warn('⚠️ Deletion already in progress, please wait...');
      return;
    }

    try {
      // 🔒 Lock the deletion mutex
      deletionInProgressRef.current = true;
      setLessonDeleting(true);

      // Step 1: Clear downloaded content (sublessons, levels, assets, monsters)
      const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);

      // 🔧 OPTIMIZATION: Batch delete with throttling to prevent crash on iOS
      // Instead of deleting all at once (causing 50+ re-renders), we:
      // 1. Delete in small chunks (2-3 items at a time)
      // 2. Add delays between chunks to allow UI to breathe and GC to run
      // 3. Pause subscriptions during deletion to prevent subscription storm
      // 4. This prevents memory spikes and excessive re-renders
      console.log(`🗑️ Starting batch deletion of ${sublessons.length} sublessons...`);

      // 🛑 PAUSE subscriptions during bulk delete to prevent subscription storm
      // This prevents 50+ re-renders and subscription callbacks during deletion
      levelSubscriptionPausedRef.current = true;
      sublessonSubscriptionPausedRef.current = true;
      console.log(`🛑 Subscriptions paused for bulk deletion`);

      // 📱 ULTRA-SAFE MODE: Prioritize memory safety over speed
      // Small chunks + longer delays = maximum GC opportunity
      const CHUNK_SIZE = 1; // Conservative: 3 sublessons at a time
      const DELAY_MS = 150; // Longer delay for better GC

      for (let i = 0; i < sublessons.length; i += CHUNK_SIZE) {
        const chunk = sublessons.slice(i, i + CHUNK_SIZE);

        // Delete chunk
        chunk.forEach((sublesson: SublessonEntity) => {
          StoreSublessons.MethodGet().remove(sublesson.id);
        });

        console.log(
          `🗑️ Deleted chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(sublessons.length / CHUNK_SIZE)} (${chunk.length} items)`,
        );

        // 🔥 Force GC after each chunk
        if (typeof (globalThis as any).gc === 'function') {
          (globalThis as any).gc();
        }

        // Add delay between chunks (except for last chunk)
        if (i + CHUNK_SIZE < sublessons.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }

      console.log(`✅ Batch deletion complete`);

      // 🔥 Force GC after sublesson deletion
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
        console.log('🧹 Forced GC after sublesson deletion');
      }

      // 🕐 Give browser time to GC before next operation
      console.log('⏳ Waiting for GC to settle...');
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Defensive cleanup: Remove any orphan levels that might not have been cleaned up
      console.log(`🗑️ Removing levels for lesson ${lessonId}...`);
      await StoreLevel.MethodGet().removeLevelsForLesson(lessonId);

      // 🔥 Force GC after level deletion
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
        console.log('🧹 Forced GC after level deletion');
      }

      // 🕐 Give browser time to GC before assets deletion
      console.log('⏳ Waiting for GC to settle...');
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Remove assets
      console.log(`🗑️ Removing assets for lesson ${lessonId}...`);
      await StoreLessonFile.MethodGet().removeAllByLessonId(lessonId);

      // 🧹 MEMORY CLEANUP: Clear URL caches and download states
      // These caches persist in memory even after deletion, causing memory leaks
      console.log(`🧹 Clearing memory caches for lesson ${lessonId}...`);
      StoreSublessons.MethodGet().clearDownloadedUrls(lessonId);
      console.log(`✅ Memory cleanup complete`);

      // Remove monsters
      console.log(`🗑️ Removing monsters for lesson ${lessonId}...`);
      StoreLessons.MethodGet().removeMonsters(lessonId);

      // 🔥 Force GC after monster deletion
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
        console.log('🧹 Forced GC after monster deletion');
      }

      // Step 2: Clear download progress flag
      StoreLessons.MethodGet().setDownloadInProgress(lessonId, false);

      // ✅ RESUME subscriptions after deletion complete
      // Now UI can update to reflect the deletion
      levelSubscriptionPausedRef.current = false;
      sublessonSubscriptionPausedRef.current = false;
      console.log(`✅ Subscriptions resumed`);

      // Trigger one final update to refresh UI state
      setLevelsUpdateCount((prev) => prev + 1);

      // Step 3: Try to refresh lesson metadata from API (hybrid approach)
      try {
        if (online) {
          debugLog(`🔄 Re-fetching lesson metadata from API for lesson ${lessonId}...`);
          const lessonResponse = await retryAsyncOperation(() =>
            API.Lesson.LessonById.Get(lessonId, true),
          );

          if (lessonResponse.status_code === 200 && lessonResponse.data) {
            // Update store with fresh metadata (no download content)
            StoreLessons.MethodGet().add(lessonResponse.data);
            setLesson(lessonResponse.data);
            debugLog(`✅ Lesson ${lessonId} metadata refreshed from API`);
          }
        } else {
          debugLog(`⚠️ Offline mode: keeping existing metadata for lesson ${lessonId}`);
        }
      } catch (error) {
        // If API fails, keep existing metadata (lesson data should still be in store)
        debugWarn(
          `⚠️ Could not refresh lesson metadata from API, keeping existing:`,
          error,
        );
        // Lesson metadata should still be in store since we didn't call remove()
      }

      // Clear sublessons from hook state (will be empty since we removed them)
      setSublessons([]);

      // 🔥 FINAL GC: Force multiple GC cycles to ensure memory is freed
      if (typeof (globalThis as any).gc === 'function') {
        for (let i = 0; i < 3; i++) {
          (globalThis as any).gc();
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        console.log('🧹 Forced 3x final GC cycles after complete deletion');
      }

      debugLog(`✅ Reset lesson ${lessonId} to undownloaded state`);
    } catch (error) {
      debugError('❌ Failed to reset lesson:', error);

      // ⚠️ CRITICAL: Always resume subscriptions even on error
      // Otherwise UI will be stuck in paused state forever
      levelSubscriptionPausedRef.current = false;
      sublessonSubscriptionPausedRef.current = false;
      console.log(`⚠️ Subscriptions resumed after error`);

      // Don't throw - allow partial cleanup to succeed
    } finally {
      // 🔒 CRITICAL: Always unlock mutex in finally block
      // This ensures we can retry deletion even if previous attempt failed
      deletionInProgressRef.current = false;
      setLessonDeleting(false);
    }
  }

  return {
    lesson,
    sublessons,
    isLessonInStore,
    isLessonDownloading,
    downloadLessonToStore,
    downloadSingleSublesson,
    syncSublessonsToStore,
    deleteLessonFromStore,
    showOfflineModal,
    setShowOfflineModal,
    checkUpdate,
    processUpdateUrls,
    downloadProgress,
    isDownloadComplete,
    isLessonDeleting,
    downloadFailedFiles,
    setDownloadFailedFiles,
  };
}
