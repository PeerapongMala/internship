import { debugError, debugLog } from '@global/helper/debug-logger';
import { getZipWorker, terminateZipWorker } from '@global/helper/upload';

/**
 * Extract JSON and assets from a ZIP file URL
 */
export async function extractJsonFromZipUrl(zipUrl: string): Promise<{
  jsonData: any;
  fileName: string;
  levelCount: number;
  assets: Map<string, Blob>;
}> {
  try {
    debugLog(`📦 Starting extraction from URL in worker: ${zipUrl}`);
    const worker = getZipWorker();

    // ส่ง URL ไป worker → worker จะ fetch เอง
    const result = await worker.extractJsonFromZipUrlInWorker(zipUrl);

    return result;
  } catch (err) {
    debugError('❌ Worker extraction from URL failed:', err);
    throw err;
  } finally {
    // 🔥 CRITICAL: Terminate worker to free memory
    terminateZipWorker();
  }
}

/**
 * 🆕 Extract nested ZIP structure from URL
 *
 * Nested ZIP structure:
 * - ZIP ชั้นนอก: มี index.json + level-*.zip files
 * - แต่ละ level ZIP: มี level-*.json + รูปภาพสำหรับด่านนั้น
 */
export async function extractNestedZipFromUrl(zipUrl: string): Promise<{
  mainIndexJson: any;
  levelsData: Array<{
    levelId: number;
    levelData: any;
    assets: Map<string, Blob>;
  }>;
  fileName: string;
}> {
  try {
    debugLog(`📦 [Nested ZIP] Starting extraction from URL in worker: ${zipUrl}`);
    const worker = getZipWorker();

    // Call worker's extractNestedZipFromUrl function
    const result = await worker.extractNestedZipFromUrl(zipUrl);

    debugLog(
      `✅ [Nested ZIP] Extracted ${result.levelsData.length} levels`,
    );

    return result;
  } catch (err) {
    debugError('❌ [Nested ZIP] Worker extraction from URL failed:', err);
    throw err;
  } finally {
    // 🔥 CRITICAL: Terminate worker to free memory
    terminateZipWorker();
  }
}

/**
 * 🔄 Auto-detect and extract ZIP (supports both nested and flat structures)
 *
 * This function automatically detects the ZIP structure:
 * - If nested structure (index.json + level-*.zip) → use nested extraction
 * - If flat structure (index.json + images at root) → use flat extraction
 *
 * Returns normalized format that's compatible with both structures
 */
export async function extractZipWithAutoDetect(zipUrl: string): Promise<{
  mainIndexJson: any;
  levelsData: Array<{
    levelId: number;
    levelData: any;
    assets: Map<string, Blob>;
  }>;
  fileName: string;
  isNested: boolean;
}> {
  try {
    debugLog(`🔍 [Auto-detect] Starting auto-detection for: ${zipUrl}`);
    const worker = getZipWorker();

    // Call worker's auto-detect function
    const result = await worker.extractZipWithAutoDetectInWorker(zipUrl);

    debugLog(
      `✅ [Auto-detect] Detected ${result.isNested ? 'NESTED' : 'FLAT (legacy)'} structure`,
    );

    return result;
  } catch (err) {
    debugError('❌ [Auto-detect] Worker extraction failed:', err);
    throw err;
  } finally {
    // 🔥 CRITICAL: Terminate worker to free memory
    terminateZipWorker();
  }
}
