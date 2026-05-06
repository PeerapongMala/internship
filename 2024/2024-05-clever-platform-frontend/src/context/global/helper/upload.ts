import {
  processLevelsFromExtractedData,
  verifySublessonDownloadComplete,
} from '@domain/g04/g04-d01/local/utils/lesson-download';
import StoreLessons from '@store/global/lessons';
import StoreSublessons from '@store/global/sublessons';
import * as Comlink from 'comlink';
import { debugError, debugLog } from './debug-logger';

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
  console.log(`🧠 [Memory] ${prefix}: ${assetCount} assets, ${sizeMB} MB total`);
}

// ========================================
// 📤 UPLOAD PROCESSING UTILITIES

// 🔥 CHANGED: Create fresh worker each time to avoid memory buildup
let rawWorkerInstance: Worker | null = null;

export function getZipWorker() {
  // Create new worker
  const worker = new Worker(
    new URL('../../../workers/json-parser.worker', import.meta.url),
    {
      type: 'module',
    },
  );
  rawWorkerInstance = worker; // Track for cleanup
  return Comlink.wrap<typeof import('../../../workers/json-parser.worker')>(worker);
}

// 🔥 NEW: Terminate worker to free memory
export function terminateZipWorker() {
  if (rawWorkerInstance) {
    rawWorkerInstance.terminate();
    rawWorkerInstance = null;
    console.log('🧹 Worker terminated and memory freed');
  }
}

/**
 * 🔄 Extract ZIP with auto-detection (supports both nested and flat structures)
 * Automatically detects whether the ZIP is nested or flat and extracts accordingly
 */
export async function extractJsonFromZipFile(file: File): Promise<{
  mainIndexJson: any;
  levelsData: Array<{
    levelId: string;
    levelData: any;
    assets: Map<string, Blob>;
  }>;
  fileName: string;
  isNested: boolean;
}> {
  // อ่านไฟล์เป็น ArrayBuffer (สามารถ transfer ได้ → ไม่ clone ซ้ำ)
  const arrayBuffer = await file.arrayBuffer();

  try {
    debugLog(`🔍 Starting auto-detect ZIP extraction from file in worker`);
    const worker = getZipWorker();

    // 🔄 ส่ง arrayBuffer ไป worker สำหรับ auto-detect extraction
    const result = await worker.extractZipWithAutoDetectFromBuffer(arrayBuffer);

    debugLog(`✅ Detected ${result.isNested ? 'NESTED' : 'FLAT (legacy)'} structure`);

    return {
      ...result,
      fileName: file.name,
    };
  } catch (err) {
    console.error('❌ ZIP extraction failed:', err);
    throw err;
  } finally {
    // 🔥 CRITICAL: Terminate worker to free memory
    terminateZipWorker();
  }
}

/**
 * Extract and log contents of a zip file (for testing/debugging)
 * 🆕 Updated for nested ZIP structure
 * @param file - The zip file to extract
 */
export async function extractAndLogZipContents(file: File): Promise<void> {
  try {
    console.log('='.repeat(60));
    console.log('📦 NESTED ZIP FILE EXTRACTION TEST');
    console.log('='.repeat(60));
    console.log(`File name: ${file.name}`);
    console.log(`File size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`File type: ${file.type}`);
    console.log('-'.repeat(60));
    const result = await extractJsonFromZipFile(file);

    console.log('\n📄 INDEX JSON INFO:');
    console.log(`  Name: ${result.fileName}`);
    console.log(`  Levels found: ${result.levelsData.length}`);
    console.log('\n📊 INDEX JSON STRUCTURE:');
    console.log('  Keys:', Object.keys(result.mainIndexJson));
    console.log('\n💾 INDEX JSON DATA:');
    console.log(JSON.stringify(result.mainIndexJson, null, 2));

    console.log('\n📦 LEVEL DATA:');
    result.levelsData.forEach(({ levelId, levelData, assets }, index) => {
      console.log(`\n  Level ${index + 1} (ID: ${levelId}):`);
      console.log(`    Keys:`, Object.keys(levelData));
      console.log(`    Assets: ${assets.size} files`);
      if (assets.size > 0) {
        console.log(`    Asset files:`, Array.from(assets.keys()));
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ NESTED EXTRACTION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ EXTRACTION FAILED:', error);
    throw error;
  }
}

// ========================================
// 📤 UPLOAD PROCESSING UTILITIES
// ========================================

/**
 * Process uploaded sublesson file and save to store
 * 🆕 Updated for nested ZIP structure
 * Handles complete upload workflow: extract → validate → process → verify
 * @param file - The nested zip file to process (from user upload)
 * @param preferredLanguage - Preferred narrative language for assets
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Processing result with success status and details
 */
export async function processUploadedSublesson(
  file: File,
  preferredLanguage: string,
  onProgress?: (progress: number) => void,
): Promise<{
  success: boolean;
  sublessonId?: number;
  lessonId?: number;
  levelCount?: number;
  questionCount?: number;
  error?: string;
}> {
  let sublessonId: number | undefined;

  try {
    debugLog(`📦 Starting ZIP upload processing for: ${file.name}`);
    console.log(`🧠 [Memory] Start upload processing: ${getMemoryInfo()}`);
    onProgress?.(10); // Starting extraction

    // Step 1: Extract ZIP with auto-detection (supports both nested and flat)
    const extractResult = await extractJsonFromZipFile(file);
    const { mainIndexJson, levelsData, isNested } = extractResult;
    debugLog(`📦 [Upload] Detected ${isNested ? 'NESTED' : 'FLAT (legacy)'} structure`);
    console.log(`🧠 [Memory] After extraction: ${getMemoryInfo()}`);
    console.log(`🧠 [Memory] Extracted ${levelsData.length} levels`);
    onProgress?.(25); // Extraction complete

    // Step 2: Validate JSON structure
    // Support multiple formats:
    // - New format: meta.lesson_id
    // - Old format (v1): root lesson_id
    // - Old format (v2): levels[0].lesson_id
    let lessonId = mainIndexJson.meta?.lesson_id ?? mainIndexJson.lesson_id;
    sublessonId = mainIndexJson.meta?.sub_lesson_id ?? mainIndexJson.sub_lesson_id;

    // Fallback: Try to get lesson_id from first level if not found at root/meta
    if (!lessonId || lessonId === 'undefined') {
      const firstLevelData = levelsData?.[0]?.levelData;
      lessonId = firstLevelData?.lesson_id;
      debugLog(`⚠️ lesson_id not found in root/meta, using from first level: ${lessonId}`);
    }

    if (!lessonId || lessonId === 'undefined') {
      throw new Error('Missing lesson_id in index JSON (checked root, meta, and levels)');
    }
    if (!sublessonId) {
      throw new Error('Missing sub_lesson_id in index JSON (checked both root and meta)');
    }
    if (!levelsData || !Array.isArray(levelsData) || levelsData.length === 0) {
      throw new Error('Invalid or missing levels data in nested ZIP');
    }

    debugLog(`📝 Processing sublesson ${sublessonId} for lesson ${lessonId}`);
    debugLog(`📊 Found ${levelsData.length} levels to process`);

    // 🆕 Clear any existing upload state (in case of re-upload) and set new state
    // StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
    StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
      isUploading: true,
      progress: 30,
      fileName: file.name,
      startTime: Date.now(),
    });

    onProgress?.(30); // Validation complete

    // Step 2.5: Check if sublesson already exists (fully downloaded)
    const sublessonExists = StoreSublessons.MethodGet().exist(sublessonId);
    if (sublessonExists) {
      const isComplete = StoreSublessons.MethodGet().isSublessonComplete(sublessonId);
      if (isComplete) {
        debugLog(`⚠️ Sublesson ${sublessonId} already exists and is complete`);
        // Clear upload state since we're not uploading
        // StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
        return {
          success: false,
          error: 'Sublesson already exists in system',
          sublessonId,
          lessonId,
        };
      }
      // If exists but not complete, continue to re-upload
      debugLog(`♻️ Re-uploading incomplete sublesson ${sublessonId}`);
    }

    // Step 3: Create lesson metadata if it doesn't exist
    const lessonExists = StoreLessons.MethodGet().exist(lessonId);
    if (!lessonExists) {
      // Try to get lesson_name from meta, root, or first level
      const firstLevelData = levelsData?.[0]?.levelData;
      const lessonName =
        mainIndexJson.meta?.lesson_name ||
        mainIndexJson.lesson_name ||
        firstLevelData?.lesson_name ||
        `Lesson ${lessonId}`;
      const subjectId =
        mainIndexJson.meta?.subject_id ||
        mainIndexJson.subject_id ||
        firstLevelData?.subject_id ||
        '';
      StoreLessons.MethodGet().add({
        id: lessonId,
        name: lessonName,
        subject_id: subjectId,
        sub_lesson_count: mainIndexJson.lesson_sub_lesson_count,
      });
      debugLog(`✅ Created lesson metadata: ${lessonName} (ID: ${lessonId})`);
    }

    // Step 4: Process and save levels to store (one level at a time)
    // 🆕 Process each level sequentially to optimize memory usage
    const totalLevels = levelsData.length;
    let processedLevels = 0;

    for (const { levelId, levelData, assets } of levelsData) {
      debugLog(`🔄 Processing level ${processedLevels + 1}/${totalLevels} (ID: ${levelId})`);
      console.log(`🧠 [Memory] Before processing level ${levelId}: ${getMemoryInfo()}`);
      logAssetsMemory(assets, `Level ${levelId} assets`);

      // Create a temporary JSON structure for this level (compatible with existing function)
      const singleLevelJson = {
        ...mainIndexJson,
        levels: [levelData], // Single level array
      };

      await processLevelsFromExtractedData(
        singleLevelJson,
        preferredLanguage,
        {
          subLessonID: String(sublessonId),
          lesson_id: lessonId,
        },
        (levelProgress) => {
          // Map level progress to overall progress (30-85)
          const baseProgress = 30 + Math.floor((processedLevels / totalLevels) * 55);
          const currentLevelContribution = Math.floor((levelProgress / 100) * (55 / totalLevels));
          const overallProgress = baseProgress + currentLevelContribution;
          onProgress?.(overallProgress);

          // 🆕 Update Store upload state
          if (sublessonId) {
            StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
              isUploading: true,
              progress: overallProgress,
              fileName: file.name,
              startTime: Date.now(),
            });
          }
        },
        assets,
      );

      processedLevels++;

      // 🆕 CRITICAL: Clear assets after processing each level to free memory
      console.log(`🧠 [Memory] Before clearing level ${levelId} assets: ${getMemoryInfo()}`);
      assets.clear();
      console.log(`🧠 [Memory] After clearing level ${levelId} assets: ${getMemoryInfo()}`);
      debugLog(`✅ Level ${levelId} processed and memory cleared (${processedLevels}/${totalLevels})`);
    }

    debugLog(`✅ Levels processed successfully`);
    console.log(`🧠 [Memory] After processing all levels: ${getMemoryInfo()}`);
    onProgress?.(85); // Processing complete

    // 🆕 Update Store state for verification step
    if (sublessonId) {
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isUploading: true,
        progress: 85,
        fileName: file.name,
        startTime: Date.now(),
      });
    }

    // Step 3.5: Mark sublesson language as downloaded BEFORE verification
    // This is required because verification checks that languages are 'DOWNLOADED'
    debugLog(
      `📝 Marking sublesson ${sublessonId} language ${preferredLanguage} as DOWNLOADED...`,
    );
    const sublesson = StoreSublessons.MethodGet().get(String(sublessonId));
    if (!sublesson) {
      throw new Error(
        `Could not find sublesson ${sublessonId} to update language status`,
      );
    }

    // Update languages to mark as DOWNLOADED
    const updatedLanguages = {
      ...sublesson.languages,
      [preferredLanguage]: 'DOWNLOADED',
    };

    StoreSublessons.MethodGet().update({
      ...sublesson,
      languages: updatedLanguages,
    });

    debugLog(
      `✅ Sublesson ${sublessonId} language ${preferredLanguage} marked as DOWNLOADED`,
    );

    // Step 4: Verify download completion (now languages are set correctly)
    const verification = verifySublessonDownloadComplete(String(sublessonId));

    if (!verification.isComplete) {
      const issues = verification.details.issues.join(', ');
      debugError(`⚠️ Verification failed:`, verification.details);
      throw new Error(`Verification failed: ${issues}`);
    }

    debugLog(`✅ Verification passed:`, {
      levels: verification.details.levelCount,
      questions: verification.details.questionCount,
    });

    // Step 4.5: Check if lesson is now complete and clear download flag
    if (lessonId) {
      const isLessonComplete = StoreLessons.MethodGet().isLessonDataComplete(lessonId);
      if (isLessonComplete) {
        // Clear download in progress flag
        StoreLessons.MethodGet().setDownloadInProgress(lessonId, false);
        debugLog(`✅ Lesson ${lessonId} is now complete, cleared download flag`);
      } else {
        debugLog(`⚠️ Lesson ${lessonId} still has incomplete sublessons`);
      }
    }

    onProgress?.(95); // Verification complete

    // 🆕 Update Store state for completion (95%)
    if (sublessonId) {
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isUploading: true,
        progress: 95,
        fileName: file.name,
        startTime: Date.now(),
      });
    }

    // Step 5: Set 100% progress in Store (keep it for history)
    onProgress?.(100); // Complete

    if (sublessonId) {
      // Set 100% and keep the state to show upload was completed successfully
      StoreSublessons.MethodGet().setSublessonDownloadState(sublessonId, {
        isUploading: false, // Mark as not uploading anymore
        progress: 100,
        fileName: file.name,
        startTime: Date.now(),
      });
      // Note: We don't clear the state here. It will be cleared when:
      // 1. User deletes the sublesson
      // 2. User re-uploads the same sublesson
      // This allows UI to show "Upload completed successfully" status
    }

    console.log(`🧠 [Memory] Upload complete: ${getMemoryInfo()}`);

    return {
      success: true,
      sublessonId,
      lessonId,
      levelCount: verification.details.levelCount,
      questionCount: verification.details.questionCount,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    debugError(`❌ Failed to process uploaded file ${file.name}:`, error);
    console.log(`🧠 [Memory] Error during upload: ${getMemoryInfo()}`);

    // 🆕 Clear upload state on error
    if (sublessonId) {
      StoreSublessons.MethodGet().clearSublessonDownloadState(sublessonId);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
