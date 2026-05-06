import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';

// Import worker (Vite will handle this with ?worker suffix)
import ExtractWorker from './extractFBX.worker?worker';

// Worker pool management
let workerPool: Worker[] = [];
const MAX_WORKERS = 1; // Limit concurrent workers to prevent memory spikes
let currentWorkerIndex = 0;

// Initialize worker pool lazily
function getWorker(): Worker {
  if (workerPool.length === 0) {
    // Create initial workers
    for (let i = 0; i < MAX_WORKERS; i++) {
      workerPool.push(new ExtractWorker());
    }
    console.log(`✅ Initialized ${MAX_WORKERS} extraction workers`);
  }

  // Round-robin worker selection
  const worker = workerPool[currentWorkerIndex];
  currentWorkerIndex = (currentWorkerIndex + 1) % MAX_WORKERS;
  return worker;
}

// Cleanup workers (call this when done with all extractions)
export function terminateExtractWorkers() {
  workerPool.forEach((worker) => worker.terminate());
  workerPool = [];
  currentWorkerIndex = 0;
  console.log('🧹 Terminated all extraction workers');
}

interface ExtractProgress {
  stage: 'downloading' | 'extracting' | 'complete';
  progress: number; // 0-100
}

/**
 * Extract FBX file from ZIP archive using Web Worker
 * This prevents blocking the main thread and isolates memory usage
 *
 * @param zipUrl - URL to the ZIP file
 * @param onProgress - Optional progress callback
 * @returns Promise with the extracted FBX blob
 */
export const extractFBXFromZip = async (
  zipUrl: string,
  onProgress?: (progress: ExtractProgress) => void,
): Promise<{ modelBlob: Blob }> => {
  // Use worker by default, fallback to main thread if worker fails
  const USE_WORKER = true;

  if (USE_WORKER) {
    return extractFBXFromZipWorker(zipUrl, onProgress);
  } else {
    return extractFBXFromZipMainThread(zipUrl);
  }
};

/**
 * Extract using Web Worker (recommended)
 */
async function extractFBXFromZipWorker(
  zipUrl: string,
  onProgress?: (progress: ExtractProgress) => void,
): Promise<{ modelBlob: Blob }> {
  return new Promise((resolve, reject) => {
    const worker = getWorker();
    const id = `extract_${Date.now()}_${Math.random()}`;

    const handleMessage = (event: MessageEvent) => {
      const { type, id: msgId } = event.data;

      // Ignore messages from other requests
      if (msgId && msgId !== id) return;

      if (type === 'progress') {
        const { stage, progress } = event.data;
        onProgress?.({ stage, progress });
      } else if (type === 'success') {
        const { modelBlob, fileName } = event.data;
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        console.log(`✅ Worker extracted: ${fileName}`);
        resolve({ modelBlob });
      } else if (type === 'error') {
        const { error } = event.data;
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        reject(new Error(error));
      }
    };

    const handleError = (error: ErrorEvent) => {
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
      console.error('Worker error:', error);
      reject(new Error(`Worker error: ${error.message}`));
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);

    // Send extraction request to worker
    worker.postMessage({
      type: 'extract',
      zipUrl,
      id,
    });
  });
}

/**
 * Extract in main thread (fallback)
 * ⚠️ This blocks the UI and uses main thread memory
 */
async function extractFBXFromZipMainThread(zipUrl: string): Promise<{ modelBlob: Blob }> {
  let zipBlob: Blob | null = null;
  let zipReader: ZipReader<Blob> | null = null;

  try {
    const response = await fetch(zipUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    zipBlob = await response.blob();
    zipReader = new ZipReader(new BlobReader(zipBlob));
    const entries = await zipReader.getEntries();

    const fbxEntry = entries.find((entry) =>
      entry.filename.toLowerCase().endsWith('.fbx'),
    );

    if (!fbxEntry || !fbxEntry.getData) {
      await zipReader.close();
      zipBlob = null;
      throw new Error('No FBX file found in ZIP');
    }

    const fbxBlob = await fbxEntry.getData(new BlobWriter());

    // Close reader and clear ZIP blob to free memory immediately
    await zipReader.close();
    zipReader = null;
    zipBlob = null;

    return { modelBlob: fbxBlob };
  } catch (error) {
    // Clean up on error
    if (zipReader) {
      await zipReader.close().catch(() => {});
    }
    zipBlob = null;
    zipReader = null;

    console.error('Error extracting FBX from ZIP:', error);
    throw error;
  }
}
