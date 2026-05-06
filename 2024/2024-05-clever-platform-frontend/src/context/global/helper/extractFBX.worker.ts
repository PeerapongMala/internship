import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';

/**
 * Web Worker for extracting FBX files from ZIP archives
 * This runs in a separate thread to prevent blocking the main UI thread
 * and isolates memory usage from the main thread
 */

interface ExtractMessage {
  type: 'extract';
  zipUrl: string;
  id: string; // Unique ID to track this request
}

interface ProgressMessage {
  type: 'progress';
  id: string;
  stage: 'downloading' | 'extracting' | 'complete';
  progress: number; // 0-100
}

interface SuccessMessage {
  type: 'success';
  id: string;
  modelBlob: Blob;
  fileName: string;
}

interface ErrorMessage {
  type: 'error';
  id: string;
  error: string;
}

type WorkerMessage = ProgressMessage | SuccessMessage | ErrorMessage;

// Listen for messages from main thread
self.addEventListener('message', async (event: MessageEvent<ExtractMessage>) => {
  const { type, zipUrl, id } = event.data;

  if (type !== 'extract') {
    return;
  }

  let zipBlob: Blob | null = null;
  let zipReader: ZipReader<Blob> | null = null;

  try {
    // Stage 1: Download ZIP
    postProgress(id, 'downloading', 0);

    const response = await fetch(zipUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Track download progress if possible
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (total > 0 && response.body) {
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        // Report download progress (0-50% of total progress)
        const downloadProgress = Math.min((receivedLength / total) * 50, 50);
        postProgress(id, 'downloading', downloadProgress);
      }

      // Combine chunks into single blob
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      zipBlob = new Blob([chunksAll]);
    } else {
      // Fallback: no progress tracking
      zipBlob = await response.blob();
    }

    postProgress(id, 'downloading', 50);

    // Stage 2: Extract FBX from ZIP
    postProgress(id, 'extracting', 50);

    zipReader = new ZipReader(new BlobReader(zipBlob));
    const entries = await zipReader.getEntries();

    postProgress(id, 'extracting', 70);

    const fbxEntry = entries.find((entry) =>
      entry.filename.toLowerCase().endsWith('.fbx'),
    );

    if (!fbxEntry || !fbxEntry.getData) {
      throw new Error('No FBX file found in ZIP');
    }

    postProgress(id, 'extracting', 80);

    const fbxBlob = await fbxEntry.getData(new BlobWriter());

    postProgress(id, 'extracting', 90);

    // Close reader and clear ZIP blob to free memory
    await zipReader.close();
    zipReader = null;
    zipBlob = null;

    postProgress(id, 'complete', 100);

    // Send success message with the extracted blob
    const successMsg: SuccessMessage = {
      type: 'success',
      id,
      modelBlob: fbxBlob,
      fileName: fbxEntry.filename,
    };
    self.postMessage(successMsg);
  } catch (error) {
    // Clean up on error
    if (zipReader) {
      await zipReader.close().catch(() => {});
    }
    zipBlob = null;
    zipReader = null;

    const errorMsg: ErrorMessage = {
      type: 'error',
      id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    self.postMessage(errorMsg);
  }
});

function postProgress(id: string, stage: ProgressMessage['stage'], progress: number) {
  const msg: ProgressMessage = {
    type: 'progress',
    id,
    stage,
    progress,
  };
  self.postMessage(msg);
}

// Notify main thread that worker is ready
self.postMessage({ type: 'ready' });
