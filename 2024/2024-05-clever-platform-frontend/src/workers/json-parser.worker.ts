import * as zip from '@zip.js/zip.js';
import * as Comlink from 'comlink';

zip.configure({});

// 🧠 Memory logging utility
function getMemoryInfo(): string {
  if ('memory' in performance) {
    const mem = (performance as any).memory;
    const usedMB = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2);
    const totalMB = (mem.totalJSHeapSize / (1024 * 1024)).toFixed(2);
    const limitMB = (mem.jsHeapSizeLimit / (1024 * 1024)).toFixed(2);
    return `${usedMB} MB used / ${totalMB} MB total (limit: ${limitMB} MB)`;
  }
  return 'Memory info not available (Enable in Chrome: --enable-precise-memory-info flag)';
}

// ฟังก์ชันหลัก: extract จาก ArrayBuffer (ใช้ร่วมกัน)
export async function extractFromBuffer(fileData: ArrayBuffer) {
  const startTime = performance.now();
  const originalSize = fileData.byteLength;
  console.log(
    `[Worker] Start extracting ZIP, size: ${(originalSize / (1024 * 1024)).toFixed(2)} MB`,
  );

  let zipReader: zip.ZipReader<unknown> | null = null;
  let entries: any[] = []; // 🔥 Track for cleanup
  try {
    zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(fileData)));
    entries = await zipReader.getEntries();
    console.log(`[Worker] Found ${entries.length} entries in ZIP`);

    const assets = new Map<string, Blob>();
    let jsonData: any = null;
    let jsonFilename = '';

    for (const entry of entries) {
      if (entry.directory) continue;

      const entryStartTime = performance.now();

      if (entry.filename.toLowerCase().endsWith('.json')) {
        const jsonString = await entry.getData(new zip.TextWriter());
        jsonData = JSON.parse(jsonString);
        console.log(
          `[Worker] Parsed JSON: ${entry.filename} (${(jsonString.length / 1024).toFixed(2)} KB)`,
        );
      } else {
        const blob = await entry.getData(new zip.BlobWriter());
        assets.set(entry.filename, blob);
        const simpleName = entry.filename.split('/').pop();
        if (simpleName && simpleName !== entry.filename) {
          assets.set(simpleName, blob);
        }
        console.log(
          `[Worker] Loaded asset: ${entry.filename} (${(blob.size / 1024).toFixed(2)} KB)`,
        );
      }

      const entryDuration = performance.now() - entryStartTime;
      console.log(
        `[Worker] Entry "${entry.filename}" processed in ${entryDuration.toFixed(2)} ms`,
      );
    }

    if (jsonData === null) {
      throw new Error('No JSON file found in ZIP archive');
    }

    const levelCount = jsonData.levels?.length || 0;
    const endTime = performance.now();
    const totalDuration = endTime - startTime;
    const assetsSize = Array.from(assets.values()).reduce(
      (sum, blob) => sum + blob.size,
      0,
    );
    const totalOutputSize =
      originalSize + assetsSize + (jsonData ? JSON.stringify(jsonData).length : 0);

    console.log(`[Worker] Extraction complete in ${totalDuration.toFixed(2)} ms`);
    console.log(
      `[Worker] Output summary: ${levelCount} levels, ${assets.size} assets, total output size ≈ ${(totalOutputSize / (1024 * 1024)).toFixed(2)} MB`,
    );

    return {
      jsonData,
      fileName: jsonFilename,
      levelCount,
      assets,
    };
  } finally {
    // 🔥 CRITICAL: Complete cleanup to free memory
    entries = []; // Clear entries array
    if (zipReader) {
      await zipReader.close().catch(() => {});
      zipReader = null; // Free zipReader reference
    }
    console.log('[Worker] Cleanup completed, memory should be freed');
  }
}

// ฟังก์ชันใหม่: extract nested ZIP (ZIP ชั้นนอก มี index.json + level-*.zip)
export async function extractNestedZipFromBuffer(fileData: ArrayBuffer) {
  const startTime = performance.now();
  const outerZipSize = fileData.byteLength;
  console.log(`📦 [Outer ZIP] Size: ${(outerZipSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`🧠 [Memory] Before extraction: ${getMemoryInfo()}`);

  let outerZipReader: zip.ZipReader<unknown> | null = null;
  let outerEntries: any[] = [];

  try {
    // Step 1: แตก ZIP ชั้นนอก
    outerZipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(fileData)));
    outerEntries = await outerZipReader.getEntries();
    console.log(`📂 [Outer ZIP] Extracted: ${outerEntries.length} entries`);
    console.log(`🧠 [Memory] After outer ZIP extraction: ${getMemoryInfo()}`);

    let mainIndexJson: any = null;
    const levelZipEntries = new Map<string, any>();

    // Step 2: อ่าน index.json และจำ level-*.zip entries
    for (const entry of outerEntries) {
      if (entry.directory) continue;

      const filename = entry.filename.toLowerCase();

      if (filename === 'index.json') {
        const jsonString = await entry.getData(new zip.TextWriter());
        mainIndexJson = JSON.parse(jsonString);
      } else if (filename.endsWith('.zip')) {
        levelZipEntries.set(entry.filename, entry);
      }
    }

    if (!mainIndexJson) {
      throw new Error('No index.json found in outer ZIP archive');
    }

    if (!mainIndexJson.levels || !Array.isArray(mainIndexJson.levels)) {
      throw new Error('index.json does not contain valid levels array');
    }

    // 🆕 ตรวจสอบว่ามี level ZIP files หรือไม่
    if (levelZipEntries.size === 0) {
      throw new Error('No level ZIP files found in nested ZIP archive. The file structure is incomplete.');
    }

    console.log(`📦 Found ${levelZipEntries.size} level ZIP files`);

    // Log if performance.memory is available
    if (!('memory' in performance)) {
      console.warn('⚠️ performance.memory not available. Memory tracking will show data size only.');
      console.warn('💡 To enable: Run Chrome with --enable-precise-memory-info flag');
    }

    // Step 3: แตกแต่ละ level ZIP ทีละตัว (ประหยัด memory)
    const levelsData: any[] = [];
    let totalAssetsCount = 0; // Track total for logging
    let totalDataExtracted = 0; // Track total data size

    for (const levelMeta of mainIndexJson.levels) {
      const { file_name, id: levelId } = levelMeta;

      if (!file_name) continue;

      const levelZipEntry = levelZipEntries.get(file_name);
      if (!levelZipEntry) continue;

      const memBefore = 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
      console.log(`🧠 [Memory] Before Level ${levelId} extraction: ${getMemoryInfo()}`);

      // 🔥 OPTIMIZED: Convert Blob to ArrayBuffer immediately to prevent dual memory allocation
      const levelZipBlob = await levelZipEntry.getData(new zip.BlobWriter());

      if (!levelZipBlob) {
        console.warn(`⚠️ [Level ${levelId}] Failed to extract ZIP blob, skipping`);
        continue;
      }

      const levelZipSize = levelZipBlob.size;
      console.log(`📦 [Level ${levelId}] ZIP size: ${(levelZipSize / 1024).toFixed(2)} KB`);

      // Convert immediately - Blob will be GC'd as soon as arrayBuffer() completes
      let levelZipData: ArrayBuffer | null = await levelZipBlob.arrayBuffer();

      if (!levelZipData) {
        console.warn(`⚠️ [Level ${levelId}] Failed to convert ZIP blob to ArrayBuffer, skipping`);
        continue;
      }

      // No need to set levelZipBlob = null, it's already out of scope and will be GC'd

      let levelZipReader: zip.ZipReader<unknown> | null = null;
      let levelEntries: any[] = [];

      try {
        levelZipReader = new zip.ZipReader(new zip.Uint8ArrayReader(new Uint8Array(levelZipData)));
        levelEntries = await levelZipReader.getEntries();

        let levelJson: any = null;
        const levelAssets = new Map<string, Blob>();
        let totalExtractedSize = 0;

        for (const entry of levelEntries) {
          if (entry.directory) continue;

          const entryFilename = entry.filename.split('/').pop() || entry.filename;

          if (entryFilename.toLowerCase().endsWith('.json')) {
            const jsonString = await entry.getData(new zip.TextWriter());
            levelJson = JSON.parse(jsonString);
            totalExtractedSize += jsonString.length;
          } else {
            const blob = await entry.getData(new zip.BlobWriter());
            levelAssets.set(entryFilename, blob);
            totalExtractedSize += blob.size;
            totalAssetsCount++;
          }
        }

        const totalExtractedMB = (totalExtractedSize / (1024 * 1024)).toFixed(2);
        totalDataExtracted += totalExtractedSize;

        console.log(
          `📂 [Level ${levelId}] Extracted: ${levelEntries.length} files, total size: ${totalExtractedMB} MB (${levelAssets.size} assets)`,
        );

        // Calculate actual memory used for this level
        const memAfter = 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
        if (memBefore > 0 && memAfter > 0) {
          const memUsed = ((memAfter - memBefore) / (1024 * 1024)).toFixed(2);
          console.log(`🧠 [Memory] Level ${levelId} used ~${memUsed} MB heap (data: ${totalExtractedMB} MB)`);
        } else {
          console.log(`🧠 [Memory] Level ${levelId} extracted ${totalExtractedMB} MB of data`);
        }
        console.log(`🧠 [Memory] Current heap state: ${getMemoryInfo()}`);

        if (levelJson) {
          levelsData.push({
            levelId,
            levelData: levelJson,
            assets: levelAssets,
          });
        }

      } finally {
        levelEntries = [];
        levelZipData = null;
        if (levelZipReader) {
          await levelZipReader.close().catch(() => {});
          levelZipReader = null;
        }
        console.log(`🧠 [Memory] After Level ${levelId} cleanup: ${getMemoryInfo()}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    levelZipEntries.clear();

    const endTime = performance.now();
    const totalDuration = endTime - startTime;
    const totalDataMB = (totalDataExtracted / (1024 * 1024)).toFixed(2);

    console.log(
      `✅ [Nested ZIP] Complete: ${levelsData.length} levels, ${totalAssetsCount} assets in ${totalDuration.toFixed(2)} ms`,
    );
    console.log(`📊 [Summary] Total data extracted: ${totalDataMB} MB`);
    console.log(`🧠 [Memory] Before final cleanup: ${getMemoryInfo()}`);

    return {
      mainIndexJson,
      levelsData,
    };

  } finally {
    outerEntries = [];
    if (outerZipReader) {
      await outerZipReader.close().catch(() => {});
      outerZipReader = null;
    }
    console.log(`🧠 [Memory] After final cleanup: ${getMemoryInfo()}`);
  }
}

export async function extractNestedZipFromUrl(zipUrl: string) {
  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch nested ZIP from URL: ${response.status} ${response.statusText}`,
    );
  }

  let arrayBuffer: ArrayBuffer | null = await response.arrayBuffer();
  const fileName = zipUrl.split('/').pop() || 'unknown.zip';

  try {
    const result = await extractNestedZipFromBuffer(arrayBuffer);
    return {
      ...result,
      fileName,
    };
  } finally {
    arrayBuffer = null;
  }
}

export async function extractJsonFromZipUrlInWorker(zipUrl: string) {
  // Worker สามารถใช้ fetch ได้!
  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ZIP from URL: ${response.status} ${response.statusText}`,
    );
  }
  let arrayBuffer: ArrayBuffer | null = await response.arrayBuffer();
  const fileName = zipUrl.split('/').pop() || 'unknown.zip';

  try {
    // ใช้ logic เดียวกัน
    const result = await extractFromBuffer(arrayBuffer);

    // override ชื่อไฟล์ด้วยชื่อจาก URL
    return {
      ...result,
      fileName,
    };
  } finally {
    // 🔥 CRITICAL: Free arrayBuffer memory
    arrayBuffer = null;
    console.log('[Worker] arrayBuffer freed');
  }
}

/**
 * 🔄 Auto-detect ZIP structure and extract accordingly
 *
 * Tries nested structure first, then falls back to flat structure if needed.
 * Returns normalized format compatible with both structures.
 */
export async function extractZipWithAutoDetectInWorker(zipUrl: string) {
  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ZIP from URL: ${response.status} ${response.statusText}`,
    );
  }

  let arrayBuffer: ArrayBuffer | null = await response.arrayBuffer();
  const fileName = zipUrl.split('/').pop() || 'unknown.zip';

  try {
    // 🔍 Try nested structure first
    console.log(`🔍 [Worker Auto-detect] Attempting nested ZIP extraction: ${zipUrl}`);

    try {
      const nestedResult = await extractNestedZipFromBuffer(arrayBuffer);
      console.log(`✅ [Worker Auto-detect] Detected NESTED structure`);

      return {
        ...nestedResult,
        fileName,
        isNested: true,
      };
    } catch (nestedError) {
      // 🔄 Fallback to flat structure
      console.log(`🔄 [Worker Auto-detect] Nested extraction failed, trying FLAT structure...`);
      console.log(`   Error was:`, nestedError);

      // ✅ Reuse existing arrayBuffer (not consumed, still valid)
      const flatResult = await extractFromBuffer(arrayBuffer);
      console.log(`✅ [Worker Auto-detect] Detected FLAT structure (legacy format)`);

      // 🔧 Convert flat structure to nested format for compatibility
      const mainJson = flatResult.jsonData;
      const levelsInJson = mainJson.levels || [];

      const levelsData = levelsInJson.map((level: any) => ({
        levelId: level.id,
        levelData: level,
        assets: flatResult.assets, // All assets shared in flat structure
      }));

      return {
        mainIndexJson: mainJson,
        levelsData: levelsData,
        fileName,
        isNested: false,
      };
    }
  } finally {
    // 🔥 CRITICAL: Free arrayBuffer memory
    arrayBuffer = null;
    console.log('[Worker] arrayBuffer freed after auto-detect');
  }
}

/**
 * 🔄 Auto-detect ZIP structure from buffer (for file upload)
 *
 * Tries nested structure first, then falls back to flat structure if needed.
 * Returns normalized format compatible with both structures.
 */
export async function extractZipWithAutoDetectFromBuffer(fileData: ArrayBuffer) {
  try {
    // 🔍 Try nested structure first
    console.log(`🔍 [Worker Auto-detect Buffer] Attempting nested ZIP extraction`);

    try {
      const nestedResult = await extractNestedZipFromBuffer(fileData);
      console.log(`✅ [Worker Auto-detect Buffer] Detected NESTED structure`);

      return {
        ...nestedResult,
        isNested: true,
      };
    } catch (nestedError) {
      // 🔄 Fallback to flat structure
      console.log(`🔄 [Worker Auto-detect Buffer] Nested extraction failed, trying FLAT structure...`);
      console.log(`   Error was:`, nestedError);

      const flatResult = await extractFromBuffer(fileData);
      console.log(`✅ [Worker Auto-detect Buffer] Detected FLAT structure (legacy format)`);

      // 🔧 Convert flat structure to nested format for compatibility
      const mainJson = flatResult.jsonData;
      const levelsInJson = mainJson.levels || [];

      const levelsData = levelsInJson.map((level: any) => ({
        levelId: level.id,
        levelData: level,
        assets: flatResult.assets, // All assets shared in flat structure
      }));

      return {
        mainIndexJson: mainJson,
        levelsData: levelsData,
        fileName: flatResult.fileName,
        isNested: false,
      };
    }
  } catch (error) {
    console.error('❌ [Worker Auto-detect Buffer] Both nested and flat extraction failed');
    throw error;
  }
}

// expose ทุกฟังก์ชัน
Comlink.expose({
  extractFromBuffer,
  extractJsonFromZipUrlInWorker,
  extractNestedZipFromBuffer,
  extractNestedZipFromUrl,
  extractZipWithAutoDetectInWorker,
  extractZipWithAutoDetectFromBuffer,
});
