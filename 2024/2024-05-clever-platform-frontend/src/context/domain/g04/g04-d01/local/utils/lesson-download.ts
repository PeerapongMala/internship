import {
  LevelDetails,
  QuestionDetails,
  TSublessonMeta,
} from '@domain/g04/g04-d03/local/type';
import { debugLog } from '@global/helper/debug-logger';
import { getDownloadConfig } from '@global/helper/download-config';
import { retryAsyncOperation } from '@global/helper/retry';
import { shouldRetryError } from '@global/helper/shouldRetryError';
import StoreLessonFile from '@store/global/lesson-files';
import StoreLevel from '@store/global/level';
import StoreSublessons from '@store/global/sublessons';

import { extractZipWithAutoDetect } from './zip-extractor';

// 🧠 Memory logging utility
function getMemoryInfo(): string {
  if ('memory' in performance) {
    const mem = (performance as any).memory;
    const usedMB = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2);
    const totalMB = (mem.totalJSHeapSize / (1024 * 1024)).toFixed(2);
    const limitMB = (mem.jsHeapSizeLimit / (1024 * 1024)).toFixed(2);
    return `${usedMB} MB used / ${totalMB} MB total (limit: ${limitMB} MB)`;
  }
  return 'Memory info not available';
}

function logAssetsMemory(assets: Map<string, Blob> | undefined, prefix: string) {
  if (!assets) {
    console.log(`🧠 [Memory] ${prefix}: No assets`);
    return;
  }

  const assetCount = assets.size;
  let totalSize = 0;
  for (const blob of assets.values()) {
    totalSize += blob.size;
  }
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(
    `🧠 [Memory] ${prefix}: ${assetCount} assets, ${sizeMB} MB total (TEMP extraction map only)`,
  );
}

// 🗄️ IndexedDB Size Calculation
async function getIndexedDBSize(
  lessonId?: string,
  sublessonId?: string,
  levelId?: string,
): Promise<{ totalSizeMB: number; fileCount: number }> {
  try {
    const store = StoreLessonFile.MethodGet();
    let totalSize = 0;
    let fileCount = 0;

    if (levelId && sublessonId && lessonId) {
      // Get size for specific level
      const files = await store.getAllByLevelId(lessonId, sublessonId, levelId);
      fileCount = files.length;
      totalSize = files.reduce((sum, file) => sum + (file.data?.size || 0), 0);
    } else if (sublessonId && lessonId) {
      // Get size for specific sublesson
      const size = await store.getSizeFromSublesson(lessonId, sublessonId);
      totalSize = size.totalSize;
      fileCount = size.fileCount;
    } else if (lessonId) {
      // Get size for specific lesson
      const size = await store.getSizeFromLesson(lessonId);
      totalSize = size.totalSize;
      fileCount = size.fileCount;
    } else {
      // Get total size across all lessons
      const allFiles = await store.getAll();
      fileCount = allFiles.length;
      totalSize = allFiles.reduce((sum, file) => sum + (file.data?.size || 0), 0);
    }

    return {
      totalSizeMB: totalSize / (1024 * 1024),
      fileCount,
    };
  } catch (error) {
    console.error('❌ Error calculating IndexedDB size:', error);
    return { totalSizeMB: 0, fileCount: 0 };
  }
}

// 🧠 Enhanced memory logging with IndexedDB comparison
async function logDetailedMemory(
  context: string,
  lessonId?: string,
  sublessonId?: string,
  levelId?: string,
) {
  const jsHeap = getMemoryInfo();
  const idbSize = await getIndexedDBSize(lessonId, sublessonId, levelId);

  console.log(`🧠 [Memory] ${context}`);
  console.log(`  📊 JS Heap: ${jsHeap}`);
  console.log(
    `  💾 IndexedDB: ${idbSize.totalSizeMB.toFixed(2)} MB (${idbSize.fileCount} files)`,
  );

  const scope = levelId
    ? `level ${levelId}`
    : sublessonId
      ? `sublesson ${sublessonId}`
      : lessonId
        ? `lesson ${lessonId}`
        : 'ALL DATA';
  console.log(`  🎯 Scope: ${scope}`);
}

/**
 * 🔥 Process levels with SHARED assets (for flat ZIP/JSON structure)
 *
 * MEMORY STRATEGY: All levels share one asset Map (optimal for reuse)
 * - Assets are cleared ONLY AFTER all levels are processed
 * - Allows asset reuse across multiple levels (same image used in different levels)
 * - Suitable for flat ZIP or JSON format where all assets are in one location
 *
 * @param levels - Array of level objects with questions
 * @param preferredNarrativeLanguage - Language to download
 * @param info - Sublesson and lesson ID information
 * @param onProgress - Callback to report progress (called after each level)
 * @param localAssets - Optional shared asset Map (cleared by CALLER after all levels)
 */
async function processLevelsInBatches(
  levels: any[],
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
  localAssets?: Map<string, Blob>,
) {
  console.log({ levelsLevelsInBatches: levels });
  // OPTIMIZATION: Process levels one at a time with memory cleanup
  // This prevents memory buildup on mobile devices

  // Get download configuration (adjustable in download-config.ts)
  const downloadConfig = getDownloadConfig();

  console.log(`🧠 [Memory] Start processLevelsInBatches: ${getMemoryInfo()}`);
  logAssetsMemory(localAssets, 'Initial localAssets');

  // 🛑 DEBUG TRACE
  if (!localAssets) {
    console.warn(`⚠️ [processLevelsInBatches] localAssets is MISSING!`);
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    console.log(
      `🧠 [Memory] Before processing level ${i + 1}/${levels.length} (ID: ${level.id}): ${getMemoryInfo()}`,
    );

    await processSingleLevel(
      level,
      preferredNarrativeLanguage,
      info,
      onProgress,
      localAssets,
    );

    // 🔥 CRITICAL: Memory cleanup after each level
    // Clear processed level data to help GC
    // NOTE: Clear AFTER processing because Store keeps reference to the same array
    if (level.questions) {
      level.questions.length = 0; // Clear array contents first
      level.questions = null; // Then nullify reference
    }

    // 🔥 MOBILE: Don't clear assets here - they'll be reused by next levels
    // Assets are cleared at the end of processLevelsFromExtractedData() instead
    // This avoids re-downloading the same assets for multiple levels

    console.log(
      `🧠 [Memory] After processing level ${i + 1}/${levels.length}: ${getMemoryInfo()}`,
    );

    // 🔥 MOBILE: Force GC hint after each level
    if (typeof (globalThis as any).gc === 'function') {
      (globalThis as any).gc();
      console.log(`🧠 [Memory] After GC hint: ${getMemoryInfo()}`);
    }

    // Delay between levels (adjustable in download-config.ts)
    // Skip delay after last level
    if (i < levels.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, downloadConfig.levelDelay));
    }
  }

  console.log(`🧠 [Memory] End processLevelsInBatches: ${getMemoryInfo()}`);
}

/**
 * 🔥 Process levels with PER-LEVEL assets (for nested ZIP structure)
 *
 * MEMORY STRATEGY: Each level has its own asset Map (per-level isolation)
 * - Assets are cleared after each level is processed
 * - Prevents memory buildup but cannot share assets between levels
 * - Suitable for nested ZIP format where each level ZIP contains its own assets
 *
 * @param levelsData - Array of {levelId, levelData, assets} from nested ZIP extraction
 * @param preferredNarrativeLanguage - Language to download
 * @param info - Sublesson and lesson ID information
 * @param onProgress - Callback to report progress (called after each level)
 */
async function processLevelsWithPerLevelAssets(
  levelsData: Array<{
    levelId: string | number;
    levelData: any;
    assets: Map<string, Blob>;
  }>,
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
) {
  // Get download configuration
  const downloadConfig = getDownloadConfig();

  console.log(`🧠 [Memory] Start processLevelsWithPerLevelAssets: ${getMemoryInfo()}`);
  console.log(`📦 Processing ${levelsData.length} levels with per-level assets`);

  // 🔥 OPTIMIZATION: Add all levels in one batch to prevent multiple re-renders
  console.log(`📦 Adding ${levelsData.length} levels to StoreLevel in BATCH mode...`);
  const validLevels = levelsData
    .filter((item) => item.levelData && item.levelData.questions)
    .map((item) => {
      // Convert 'questions' to 'questionList' for StoreLevel
      const level = item.levelData;
      const mapped = {
        ...level,
        questionList: level.questions, // Map questions → questionList
      };
      console.log(
        `  📝 Level ${level.id}: ${level.questions?.length || 0} questions → questionList`,
      );
      return mapped;
    });

  if (validLevels.length === 0) {
    console.warn(`⚠️ No valid levels to process`);
    return;
  }

  const totalQuestions = validLevels.reduce(
    (sum, l) => sum + (l.questionList?.length || 0),
    0,
  );
  console.log(`📊 Total: ${validLevels.length} levels, ${totalQuestions} questions`);

  StoreLevel.MethodGet().addLevelsBatch(validLevels);
  console.log(
    `✅ Added ${validLevels.length} levels with ${totalQuestions} questions in one batch (1 setState call)`,
  );

  // 🔥 แก้ไข: สร้าง Map ที่รวม assets จากทุก levels เข้าด้วยกัน
  // เพื่อให้ downloadLevelAssets (ที่ process ทุก levels พร้อมกัน) สามารถเข้าถึง
  // assets ที่ถูกต้องของแต่ละ level ได้
  const mergedAssets = new Map<string, Blob>();
  let totalAssetsCount = 0;

  console.log(`🔄 กำลังรวม assets จาก ${levelsData.length} levels...`);
  for (const { levelId, assets } of levelsData) {
    if (assets && assets.size > 0) {
      console.log(`  📦 Level ${levelId}: ${assets.size} assets`);
      // รวม assets ทั้งหมดเข้าไปใน Map เดียว
      for (const [key, blob] of assets.entries()) {
        mergedAssets.set(key, blob);
      }
      totalAssetsCount += assets.size;
    }
  }
  console.log(
    `✅ รวม ${totalAssetsCount} assets ทั้งหมดจาก ${levelsData.length} levels (${mergedAssets.size} ไฟล์ไม่ซ้ำ)`,
  );
  console.log(
    'mergedAssets size:',
    mergedAssets.size,
    'keys:',
    Array.from(mergedAssets.keys()),
  );

  // 🔥 Download assets ครั้งเดียวสำหรับทั้ง sublesson โดยใช้ merged assets
  console.log(
    `📥 กำลัง download assets สำหรับ sublesson ${info.subLessonID} ด้วย merged asset map`,
  );
  try {
    await retryAsyncOperation(
      () =>
        StoreSublessons.MethodGet().downloadLevelAssets(
          info.subLessonID,
          preferredNarrativeLanguage,
          mergedAssets, // ✅ ส่ง merged assets ที่มีของทุก level แล้ว
        ),
      3,
      1000,
      shouldRetryError,
    );
    console.log(`✅ Download assets เสร็จสมบูรณ์สำหรับ sublesson ${info.subLessonID}`);

    // รายงาน progress สำหรับทุก levels (เพราะเรา process พร้อมกันหมดแล้ว)
    if (onProgress) {
      console.log(`📊 รายงาน progress สำหรับ ${levelsData.length} levels`);
      onProgress(levelsData.length);
    }
  } catch (error) {
    console.error(
      `❌ Failed to download assets for sublesson ${info.subLessonID}:`,
      error,
    );
    console.error(`📊 Failure details:`, {
      sublessonId: info.subLessonID,
      language: preferredNarrativeLanguage,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }

  // 🔥 ทำความสะอาด Memory: เคลียร์ assets ของแต่ละ level หลังจาก download เสร็จแล้ว
  for (let i = 0; i < levelsData.length; i++) {
    const { levelId, levelData, assets } = levelsData[i];

    console.log(
      `🧠 [Memory] กำลังทำความสะอาด level ${i + 1}/${levelsData.length} (ID: ${levelId}): ${getMemoryInfo()}`,
    );

    // เคลียร์ข้อมูล level ที่ process เสร็จแล้วเพื่อช่วย GC
    if (levelData.questions) {
      levelData.questions.length = 0; // เคลียร์ข้อมูลใน array ก่อน
      levelData.questions = null; // แล้วค่อย nullify reference
    }

    console.log(
      `🧠 [Memory] Before clearing level ${levelId} assets: ${getMemoryInfo()}`,
    );
    logAssetsMemory(assets, `Level ${levelId} assets before clear`);

    // 🗄️ Log IndexedDB size BEFORE clearing temp map
    await logDetailedMemory(
      `After downloading level ${levelId} (before clearing temp map)`,
      info.lesson_id,
      info.subLessonID,
      String(levelId),
    );

    // 🔥 Clear this level's assets (different from shared assets approach)
    assets.clear();

    console.log(`🧠 [Memory] After clearing level ${levelId} assets: ${getMemoryInfo()}`);

    // 🔥 CRITICAL: Force GC hint after each level
    // Chrome exposes gc() with --js-flags="--expose-gc"
    // This helps prevent memory buildup during long download processes
    if (typeof (globalThis as any).gc === 'function') {
      (globalThis as any).gc();
      console.log(`🧠 [Memory] After GC for level ${levelId}: ${getMemoryInfo()}`);
    } else {
      // Even without explicit GC, we can hint to the browser
      // Create and immediately discard a large object to trigger GC
      if (i % 5 === 0) {
        // Every 5 levels
        const hint = new Array(1000).fill(null);
        hint.length = 0;
        console.log(
          `🧠 [Memory] GC hint sent for level ${levelId} (no explicit gc available)`,
        );
      }
    }

    // Delay between levels (adjustable in download-config.ts)
    // Skip delay after last level
    if (i < levelsData.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, downloadConfig.levelDelay));
    }
  }

  console.log(`🧠 [Memory] End processLevelsWithPerLevelAssets: ${getMemoryInfo()}`);
}

/**
 * 🔍 Verify that language status was updated after download/update operation
 *
 * Logs a warning if the sublesson doesn't have proper language status set.
 * This helps catch issues where download succeeds but state isn't updated correctly.
 *
 * @param sublessonId - ID of sublesson to check
 * @param context - Context string for the warning message ('download' or 'update')
 */
function warnIfLanguageStatusNotUpdated(
  sublessonId: string,
  context: 'download' | 'update',
) {
  const sublesson = StoreSublessons.MethodGet().get(sublessonId);
  if (!sublesson?.languages || Object.keys(sublesson.languages).length === 0) {
    console.error(
      `⚠️ WARNING: Languages status not updated after ${context} for sublesson ${sublessonId}!`,
    );
    if (context === 'download') {
      console.error(`This will cause verification to fail and UI to not update.`);
    }
  }
}

/**
 * 🧹 Clean up incomplete download/update on error
 *
 * Removes incomplete levels and resets sublesson state when an operation fails.
 * This ensures the store doesn't contain partial/corrupted data.
 *
 * @param sublessonId - ID of sublesson to clean up
 * @param context - Context describing the failed operation (e.g., 'Level processing', 'Level update')
 */
function cleanupFailedOperation(sublessonId: string, context: string) {
  try {
    const sublesson = StoreSublessons.MethodGet().get(sublessonId);
    if (sublesson) {
      debugLog(
        `⚠️ ${context} failed for sublesson ${sublessonId}, clearing incomplete content (keeping metadata)`,
      );

      // Remove incomplete levels from StoreLevel
      const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);
      if (levels && levels.length > 0) {
        StoreLevel.MethodGet().removeLevelsForSublesson(sublessonId);
      }

      // Reset sublesson download state
      StoreSublessons.MethodGet().update({
        ...sublesson,
        languages: {}, // Mark as not downloaded
        levels_by_student: undefined,
      });
    }
  } catch (cleanupError) {
    console.error('❌ Error cleaning up failed operation:', cleanupError);
  }
}

async function processSingleLevel(
  level: any,
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
  localAssets?: Map<string, Blob>,
) {
  console.log({ levelProcessSingleLevel: level });
  // Get download configuration
  const downloadConfig = getDownloadConfig();
  StoreLevel.MethodGet().addLevel(level);
  StoreLevel.MethodGet().addQuestionList(String(level.id), level.questions);

  try {
    // 🛑 DEBUG TRACE
    if (!localAssets) {
      console.warn(`⚠️ [processSingleLevel] localAssets is MISSING!`);
    }

    await retryAsyncOperation(
      () =>
        StoreSublessons.MethodGet().downloadLevelAssets(
          level.sub_lesson_id,
          preferredNarrativeLanguage,
          localAssets, // 🆕 Pass local assets
        ),
      3,
      1000, // Reduced from 2000ms to 1000ms for faster retry
      shouldRetryError,
    );
    if (onProgress) onProgress(1);
    await new Promise((resolve) => setTimeout(resolve, downloadConfig.levelDelay));
  } catch (error) {
    console.error(`❌ Failed to download assets for level ${level.id}:`, error);
    console.error(`📊 Failure details:`, {
      levelId: level.id,
      sublessonId: level.sub_lesson_id,
      language: preferredNarrativeLanguage,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }

  // Note: level.questions cleanup handled by caller (processLevelsInBatches)
  // Cannot clear here because Store keeps reference to the same array!
}

/**
 * 📦 Process levels from pre-extracted JSON data (for flat ZIP/JSON structure)
 *
 * This function handles the flat ZIP format where:
 * - One JSON file contains all level data
 * - One shared asset pool for all levels
 *
 * MEMORY STRATEGY: Uses shared assets via processLevelsInBatches
 *
 * @param jsonData - Pre-extracted JSON data containing levels and metadata
 * @param preferredNarrativeLanguage - Language to download
 * @param info - Sublesson and lesson ID information
 * @param onProgress - Callback to report progress
 * @param localAssets - Optional shared asset Map containing all level assets
 */
export async function processLevelsFromExtractedData(
  jsonData: {
    sub_lesson_id?: number;
    sub_lesson_name?: string; // Support old format (root level)
    updated_at: string;
    lesson_id?: number;
    meta?: TSublessonMeta; // Support new format (meta object)
    levels: (Omit<LevelDetails, 'questionList'> & {
      questions: QuestionDetails[];
    })[];
  },
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
  localAssets?: Map<string, Blob>, // 🆕 Accept localAssets
) {
  try {
    if (!jsonData?.levels) {
      throw new Error('Invalid levels data format in JSON');
    }

    // Add sublesson metadata (without levels - levels are stored separately in StoreLevel)
    // Use info.subLessonID which was already extracted with support for both JSON formats
    const sublessonData = {
      id: Number(info.subLessonID),
      lesson_id: info.lesson_id,
      sub_lesson_id: Number(info.subLessonID),
      // Support both old format (root level) and new format (meta object)
      sub_lesson_name: jsonData.meta?.sub_lesson_name ?? jsonData.sub_lesson_name,
      updated_at: jsonData.updated_at,
      languages: {}, // 🆕 Initialize empty languages object for status tracking
    };
    console.log({ sublessonData: sublessonData });
    StoreSublessons.MethodGet().add(sublessonData);

    // Process levels and download assets
    await processLevelsInBatches(
      jsonData.levels,
      preferredNarrativeLanguage,
      info,
      onProgress,
      localAssets, // 🆕 Pass local assets
    );

    // 🆕 CRITICAL: Verify languages status was updated after download
    const sublessonAfterDownload = StoreSublessons.MethodGet().get(info.subLessonID);

    if (
      !sublessonAfterDownload?.languages ||
      Object.keys(sublessonAfterDownload.languages).length === 0
    ) {
      console.error(
        `⚠️ WARNING: Languages status not updated for sublesson ${info.subLessonID}!`,
      );
      console.error(`This will cause verification to fail and UI to not update.`);
    }

    // 🔥 CRITICAL: Clear assets ONLY after ALL levels processed
    // This allows assets to be reused across multiple levels
    if (localAssets && localAssets.size > 0) {
      console.log(`🧠 [Memory] Before clearing assets: ${getMemoryInfo()}`);
      logAssetsMemory(localAssets, 'Assets before clear');

      localAssets.clear();

      console.log(`🧠 [Memory] After clearing assets: ${getMemoryInfo()}`);
    }
  } catch (error) {
    console.error('❌ Error processing levels from extracted data:', error);
    console.error('📍 Failed at sublesson:', info.subLessonID);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // 🔥 CRITICAL FIX: Complete cleanup of incomplete download
    cleanupFailedOperation(info.subLessonID, 'Level processing');

    // 🔥 CRITICAL: Clear assets even on error to prevent memory leak
    if (localAssets && localAssets.size > 0) {
      console.log(
        `🧠 [Memory] Error cleanup - before clearing assets: ${getMemoryInfo()}`,
      );
      logAssetsMemory(localAssets, 'Assets on error');

      localAssets.clear();

      console.log(
        `🧠 [Memory] Error cleanup - after clearing assets: ${getMemoryInfo()}`,
      );
    }

    throw error;
  }
}

/**
 * 🔄 Update/re-download levels from a single nested ZIP link
 *
 * This function handles the nested ZIP format where:
 * - Outer ZIP contains index.json + multiple level-*.zip files
 * - Each level ZIP has its own assets (per-level isolation)
 *
 * MEMORY STRATEGY: Uses per-level assets via processLevelsWithPerLevelAssets
 * - Clears existing levels before update
 * - Processes each level with its own asset Map
 *
 * @param link - URL to the nested ZIP file
 * @param preferredNarrativeLanguage - Language to download
 * @param info - Sublesson and lesson ID information
 * @param onProgress - Callback to report progress
 */
export async function upDateDownloadLevelsFromSingleZipLink(
  link: string,
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
) {
  try {
    // 🔄 Step 1: Extract ZIP with auto-detection (supports both nested and flat)
    const extractResult = await extractZipWithAutoDetect(link);

    const { mainIndexJson, levelsData, isNested } = extractResult;
    debugLog(`📦 [Download] Detected ${isNested ? 'NESTED' : 'FLAT (legacy)'} structure`);

    if (!mainIndexJson) {
      throw new Error('No main index.json found in nested ZIP');
    }

    if (!levelsData || levelsData.length === 0) {
      throw new Error('No level data found in nested ZIP');
    }

    // Step 2: Clear existing levels
    StoreLevel.MethodGet().removeLevelsForSublesson(info.subLessonID);

    // Step 3: Update sublesson metadata (without levels - levels stored in StoreLevel)
    const existingSublesson = StoreSublessons.MethodGet().get(info.subLessonID);
    const mergedSublessonData = {
      ...(existingSublesson || {}), // ✅ Keep existing data first
      id: Number(info.subLessonID),
      lesson_id: info.lesson_id,
      sub_lesson_id: Number(info.subLessonID),
      // Support both old format (root level) and new format (meta object)
      sub_lesson_name:
        mainIndexJson.meta?.sub_lesson_name ?? mainIndexJson.sub_lesson_name,
      updated_at: mainIndexJson.updated_at,
      // ✅ Preserve existing languages, will be updated by downloadLevelAssets
      languages: existingSublesson?.languages || {},
    };
    console.log({ mergedSublessonData: mergedSublessonData });

    StoreSublessons.MethodGet().update(mergedSublessonData);

    // Step 4: Process each level with its assets using helper
    await processLevelsWithPerLevelAssets(
      levelsData,
      preferredNarrativeLanguage,
      info,
      onProgress,
    );

    warnIfLanguageStatusNotUpdated(info.subLessonID, 'update');
  } catch (error) {
    console.error('❌ Error updating levels:', error);
    console.error('📍 Failed at sublesson:', info.subLessonID);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // 🔥 CRITICAL FIX: Complete cleanup of incomplete update
    cleanupFailedOperation(info.subLessonID, 'Level update');

    throw error;
  }
}
/**
 * 🔍 Comprehensive Verification: เช็คว่า sublesson ดาวน์โหลดครบ 100% จริง
 *
 * ตรวจสอบ:
 * 1. ✅ Sublesson metadata exists
 * 2. ✅ Levels exist และมี questions
 * 3. ✅ Language status ถูกต้อง (DOWNLOADED)
 * 4. ✅ Assets/files ครบถ้วน (ถ้าสามารถตรวจสอบได้)
 *
 * @param sublessonId - ID ของ sublesson ที่ต้องการตรวจสอบ
 * @returns Object containing verification results
 */
// 🎯 Whitelist approach - only these statuses are considered complete
const VALID_COMPLETE_STATUSES = ['DOWNLOADED'] as const;
type ValidCompleteStatus = (typeof VALID_COMPLETE_STATUSES)[number];

export function verifySublessonDownloadComplete(sublessonId: string): {
  isComplete: boolean;
  details: {
    hasSublessonMetadata: boolean;
    hasValidLevels: boolean;
    hasCorrectLanguageStatus: boolean;
    levelCount: number;
    questionCount: number;
    issues: string[];
  };
} {
  const issues: string[] = [];

  // 1. เช็ค sublesson metadata
  const sublesson = StoreSublessons.MethodGet().get(sublessonId);
  const hasSublessonMetadata = !!sublesson;
  if (!hasSublessonMetadata) {
    issues.push('Sublesson metadata not found in store');
  }

  // 2. เช็ค levels และ questions
  const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);
  const levelCount = levels?.length || 0;
  const questionCount =
    levels?.reduce((sum, level) => sum + (level.questionList?.length || 0), 0) || 0;

  // 🔧 RELAXED VALIDATION: Check total questions only (not per-level)
  // Some levels might be intro/summary without questions, which is valid
  const hasValidLevels = levels && levels.length > 0;
  const hasEnoughQuestions = questionCount > 0;

  // 📊 Detailed logging for diagnosis
  if (levels && levels.length > 0) {
    const levelDetails = levels.map((level) => ({
      id: level.id,
      hasQuestionList: !!level.questionList,
      questionCount: level.questionList?.length || 0,
    }));
    debugLog(`📊 Level validation for sublesson ${sublessonId}:`, levelDetails);
  }

  if (!hasValidLevels || !hasEnoughQuestions) {
    issues.push(
      `Invalid levels: found ${levelCount} levels, ${questionCount} questions (need at least 1 question total)`,
    );
  }

  // 3. เช็ค language status - 🎯 ใช้ WHITELIST approach แทน blacklist
  let hasCorrectLanguageStatus = false;
  if (sublesson?.languages && Object.keys(sublesson.languages).length > 0) {
    const statuses = Object.values(sublesson.languages);

    // ⚠️ Log unknown statuses for monitoring
    const unknownStatuses = statuses.filter(
      (s) =>
        !VALID_COMPLETE_STATUSES.includes(s as ValidCompleteStatus) &&
        s !== 'PARTIAL' &&
        s !== 'UNDOWNLOADED' &&
        s !== 'PENDING',
    );
    if (unknownStatuses.length > 0) {
      debugLog(
        `⚠️ Unknown language statuses detected for ${sublessonId}:`,
        unknownStatuses,
      );
    }

    // ✅ WHITELIST: ทุกภาษาต้องเป็น 'DOWNLOADED' เท่านั้น
    const allComplete = statuses.every((s) =>
      VALID_COMPLETE_STATUSES.includes(s as ValidCompleteStatus),
    );
    const hasAtLeastOne = statuses.length > 0;
    hasCorrectLanguageStatus = allComplete && hasAtLeastOne;

    if (!hasCorrectLanguageStatus) {
      issues.push(`Language status incorrect: ${JSON.stringify(sublesson.languages)}`);
    }
  } else {
    issues.push('No language data found');
  }

  // 4. รวมผลการตรวจสอบ
  const isComplete =
    hasSublessonMetadata &&
    hasValidLevels &&
    hasEnoughQuestions &&
    hasCorrectLanguageStatus;

  const result = {
    isComplete,
    details: {
      hasSublessonMetadata,
      hasValidLevels: hasValidLevels && hasEnoughQuestions, // Combined check
      hasCorrectLanguageStatus,
      levelCount,
      questionCount,
      issues,
    },
  };

  debugLog(`🔍 verifySublessonDownloadComplete(${sublessonId}):`, result);

  return result;
}

/**
 * 🗑️ Verify Delete: ตรวจสอบว่า sublesson ถูกลบสำเร็จจริง
 *
 * @param sublessonId - ID ของ sublesson ที่ควรถูกลบแล้ว
 * @returns true ถ้าลบสำเร็จ (ไม่พบข้อมูลใน store)
 */
export function verifySublessonDeleted(sublessonId: string): {
  isDeleted: boolean;
  remainingData: {
    hasSublessonMetadata: boolean;
    hasLevels: boolean;
    hasDownloadState: boolean;
  };
} {
  const hasSublessonMetadata = StoreSublessons.MethodGet().exist(sublessonId);
  const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);
  const hasLevels = levels && levels.length > 0;
  const downloadState =
    StoreSublessons.MethodGet().getSublessonDownloadState(sublessonId);
  const hasDownloadState = !!downloadState;

  const isDeleted = !hasSublessonMetadata && !hasLevels && !hasDownloadState;

  const result = {
    isDeleted,
    remainingData: {
      hasSublessonMetadata,
      hasLevels: hasLevels || false,
      hasDownloadState,
    },
  };

  debugLog(`🗑️ verifySublessonDeleted(${sublessonId}):`, result);

  return result;
}

/**
 * 📥 Download levels from a nested ZIP structure (initial download)
 *
 * This function handles the nested ZIP format where:
 * - Outer ZIP contains index.json + multiple level-*.zip files
 * - Each level ZIP has its own level-*.json + assets for that level
 *
 * MEMORY STRATEGY: Uses per-level assets via processLevelsWithPerLevelAssets
 * - Each level has isolated assets (no sharing between levels)
 * - Assets cleared after each level to minimize memory footprint
 *
 * @param link - URL to the nested ZIP file
 * @param preferredNarrativeLanguage - Language to download
 * @param info - Sublesson and lesson ID information
 * @param onProgress - Callback to report progress (called after each level completes)
 */
export async function downloadLevelsFromNestedZip(
  link: string,
  preferredNarrativeLanguage: string,
  info: { subLessonID: string; lesson_id: string },
  onProgress?: (increment: number) => void,
) {
  try {
    // 🔄 Step 1: Extract ZIP with auto-detection (supports both nested and flat)
    const extractResult = await extractZipWithAutoDetect(link);

    const { mainIndexJson, levelsData, isNested } = extractResult;
    debugLog(`📦 [Download] Detected ${isNested ? 'NESTED' : 'FLAT (legacy)'} structure`);

    if (!mainIndexJson) {
      throw new Error('No main index.json found in nested ZIP');
    }

    if (!levelsData || levelsData.length === 0) {
      throw new Error('No level data found in nested ZIP');
    }

    // Step 2: Clear existing levels for this sublesson
    StoreLevel.MethodGet().removeLevelsForSublesson(info.subLessonID);

    // Step 3: Add sublesson metadata (without levels - levels stored in StoreLevel)
    const existingSublesson = StoreSublessons.MethodGet().get(info.subLessonID);
    const sublessonData = {
      id: Number(info.subLessonID),
      lesson_id: info.lesson_id,
      sub_lesson_id: Number(info.subLessonID),
      // Support both old format (root level) and new format (meta object)
      sub_lesson_name:
        mainIndexJson.meta?.sub_lesson_name ?? mainIndexJson.sub_lesson_name,
      updated_at: mainIndexJson.updated_at,
      languages: {},
      ...(existingSublesson || {}),
    };
    console.log({ sublessonData: sublessonData });

    StoreSublessons.MethodGet().update(sublessonData);

    // Step 4: Process each level with its assets using helper
    await processLevelsWithPerLevelAssets(
      levelsData,
      preferredNarrativeLanguage,
      info,
      onProgress,
    );

    // Step 5: Verify language status
    warnIfLanguageStatusNotUpdated(info.subLessonID, 'download');
  } catch (error) {
    console.error('❌ Error downloading from nested ZIP:', error);
    console.error('📍 Failed at sublesson:', info.subLessonID);
    console.error('📊 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // 🔥 CRITICAL FIX: Complete cleanup of incomplete download
    cleanupFailedOperation(info.subLessonID, 'Level processing');

    throw error;
  }
}
