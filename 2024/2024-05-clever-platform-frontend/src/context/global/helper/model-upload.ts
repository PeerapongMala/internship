import { StoreModelFileMethods } from '@store/global/avatar-models';
import { extractFBXFromZip } from './extractFBX';

/**
 * Process an uploaded model ZIP file
 * Extracts FBX from ZIP and stores in IndexedDB
 *
 * @param file - The uploaded ZIP file containing an FBX model
 * @param onProgress - Optional progress callback (0-100)
 * @returns Result object with success status, modelKey, and blob or error message
 */
export async function processUploadedModel(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{
  success: boolean;
  modelKey?: string;
  modelBlob?: Blob;
  error?: string;
}> {
  try {
    onProgress?.(10);

    // Create temporary object URL from uploaded file
    const fileUrl = URL.createObjectURL(file);

    onProgress?.(30);

    // Extract FBX from ZIP
    const { modelBlob } = await extractFBXFromZip(fileUrl);

    onProgress?.(60);

    // Generate model key from filename (remove .zip extension)
    const modelKey = file.name.replace(/\.zip$/i, '');

    // Store model in IndexedDB (pass blob directly)
    await StoreModelFileMethods.addItem(
      modelKey,
      modelBlob,
      '1.0.0', // Default version for uploaded models
    );

    onProgress?.(100);

    // Clean up temporary URL
    URL.revokeObjectURL(fileUrl);

    return {
      success: true,
      modelKey,
      modelBlob,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('Error processing uploaded model:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
