// src/utils/zipHelper.ts
import JSZip from 'jszip';
import { fetchWithAuth } from './fetch';

/**
 * Type definition for ZIP operation responses
 * @template T - Type of data that might be included in the response
 */
export interface ZipResponse<T = any> {
  success: boolean; // Whether the operation succeeded
  zip?: JSZip; // The JSZip instance if successful
  error?: string; // Error message if failed
  progress?: number; // Progress percentage (0-100)
  data?: T; // Additional data payload
}

/**
 * Custom error type for ZIP operations
 */
export interface ZipError extends Error {
  type: 'NETWORK' | 'ZIP' | 'FILE_NOT_FOUND' | 'INVALID_FORMAT' | 'UNKNOWN' | 'TIMEOUT';
  filename?: string; // Name of file involved in error
  statusCode?: number; // HTTP status code if network error
  originalError?: any; // Original error object
}

// Callback type for progress updates
type ProgressCallback = (progress: number) => void;

// Type for content that can be added to a ZIP file
type ZipFileContent = Record<string, string | Blob | Uint8Array | any>;

// Options for creating ZIP files
type CreateZipOptions = {
  compression?: 'STORE' | 'DEFLATE'; // Compression method
  comment?: string; // ZIP file comment
};

interface ExtractedFBXModel {
  modelUrl: string;
  textures: {
    name: string;
    url: string;
  }[];
  animations?: any[];
  metadata?: any;
  modelBlob?: Blob;
}

export type SubLessonUrlDataResponse = {
  sub_lesson_id: number;
  url: string;
  new_updated_at?: string | null;
};

export type SubLessonUrlListResponseV2 = SubLessonUrlDataResponse[];

export type SubLessonUrlListResponseV1 = Record<string, string>;

// Cache system configuration
const MAX_CACHE_SIZE = 50; // Maximum number of ZIPs to cache
const MAX_OBJECT_URL_CACHE_SIZE = 100; // Maximum number of object URLs to cache
const zipCache = new Map<string, JSZip>(); // Cache for ZIP objects
const objectUrlCache = new Map<string, string>(); // Cache for object URLs

/**
 * Checks if a filename is a media file based on extension
 * @param filename - The filename to check
 * @returns true if the file is a media file
 */
function isMediaFile(filename: string): boolean {
  return /\.(png|jpg|jpeg|gif|webp|mp3|wav|ogg|mp4|webm|fbx)$/i.test(filename);
}

/**
 * Gets the MIME type for a filename based on its extension
 * @param filename - The filename to check
 * @returns The corresponding MIME type or undefined if unknown
 */
function getMimeType(filename: string): string | undefined {
  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    fbx: 'application/octet-stream',
  };
  return mimeTypes[extension || ''];
}

/**
 * Adds a ZIP to cache with LRU (Least Recently Used) eviction policy
 * @param key - Cache key (typically the URL)
 * @param value - JSZip instance to cache
 */
function addToCache(key: string, value: JSZip) {
  if (zipCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = zipCache.keys().next().value;
    if (oldestKey) {
      zipCache.delete(oldestKey);
    }
  }
  zipCache.set(key, value);
}

/**
 * Reads data from a ReadableStream with progress reporting
 * @param reader - The stream reader
 * @param chunks - Array to store received chunks
 * @param onProgress - Callback for progress updates
 */
async function readStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  chunks: Uint8Array[],
  onProgress?: (progress: { chunkSize: number }) => void,
) {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    onProgress?.({ chunkSize: value.length });
  }
}

/**
 * Wraps ZIP operations with consistent error handling
 * @template T - Return type of the operation
 * @param operation - The async function to execute
 * @returns Result of the operation or throws ZipError
 */
async function safeZipOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    const err = error as Error;
    console.error('ZipOperation Error:', error);

    const zipError: ZipError = {
      name: 'ZipOperationError',
      message: err.message || 'Unknown ZIP error',
      type: 'ZIP',
      stack: err.stack,
      originalError: error,
    };

    throw zipError;
  }
}

/**
 * Downloads and extracts a ZIP file from a URL
 * @template T - Type of additional data in response
 * @param url - URL of the ZIP file
 * @param useCache - Whether to use cached version if available
 * @param progressCallback - Callback for download progress
 * @returns Promise with ZipResponse containing the JSZip instance
 */
export async function downloadAndExtractZip<T = any>(
  url: string,
  useCache: boolean = true,
  progressCallback?: ProgressCallback,
): Promise<ZipResponse<T>> {
  try {
    // Check cache first if enabled
    if (useCache && zipCache.has(url)) {
      return {
        success: true,
        zip: zipCache.get(url)!,
        progress: 100,
      };
    }

    // Fetch the ZIP file with authentication
    const response = await fetchWithAuth(url, {
      headers: {
        Accept: 'application/zip',
      },
    });

    if (!response.ok) {
      const error: ZipError = {
        name: 'HTTPError',
        message: `HTTP error! status: ${response.status}`,
        type: 'NETWORK',
        statusCode: response.status,
      };
      throw error;
    }

    // First check if response is actually a ZIP
    const contentType = response.headers.get('content-type');
    if (
      !contentType?.includes('application/zip') &&
      !contentType?.includes('application/octet-stream')
    ) {
      // Try to read as text to get more error info
      const text = await response.text();
      throw {
        name: 'InvalidContentType',
        message: `Expected ZIP file but got ${contentType}. Response: ${text.slice(0, 100)}...`,
        type: 'INVALID_FORMAT',
      };
    }

    // Prepare to read the stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw {
        name: 'ReadableStreamError',
        message: 'Response body is not readable',
        type: 'NETWORK',
      } as ZipError;
    }

    // Track download progress
    const contentLength = +(response.headers.get('Content-Length') || 0);
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];

    await readStream(reader, chunks, (progress) => {
      receivedLength += progress.chunkSize;
      const percent =
        contentLength > 0 ? Math.round((receivedLength / contentLength) * 100) : 0;
      progressCallback?.(percent);
    });

    // Create and load the ZIP file
    const blob = new Blob(chunks as BlobPart[], { type: 'application/zip' });

    // Validate the ZIP before processing
    if (blob.size < 100) {
      throw {
        name: 'InvalidZipError',
        message: 'Downloaded file is too small to be a valid ZIP',
        type: 'INVALID_FORMAT',
      };
    }

    // Try to load the ZIP with timeout
    const zip = (await Promise.race([
      JSZip.loadAsync(blob),
      new Promise(
        (_, reject) =>
          setTimeout(
            () =>
              reject({
                name: 'ZipLoadTimeout',
                message: 'ZIP loading timed out',
                type: 'TIMEOUT',
              }),
            30000,
          ), // 30 second timeout
      ),
    ])) as JSZip;

    // Cache the result if enabled
    if (useCache) {
      addToCache(url, zip);
    }

    return {
      success: true,
      zip,
      progress: 100,
    };
  } catch (error: unknown) {
    const err = error as ZipError;
    console.error('Download failed:', err);
    return {
      success: false,
      error: err.message || 'Unknown error occurred',
      progress: 0,
    };
  }
}

/**
 * Extracts JSON data from a file in the ZIP archive
 * @template T - Type of the JSON data
 * @param zip - JSZip instance
 * @param filename - Name of the JSON file in the ZIP
 * @returns Parsed JSON data
 */
export async function getJsonFromZip<T = any>(zip: JSZip, filename: string): Promise<T> {
  return safeZipOperation(async () => {
    const file = zip.file(filename);
    if (!file) {
      throw {
        name: 'FileNotFoundError',
        message: `File ${filename} not found in ZIP`,
        type: 'FILE_NOT_FOUND',
        filename,
      } as ZipError;
    }

    const content = await file.async('text');
    try {
      return JSON.parse(content);
    } catch (error) {
      throw {
        name: 'InvalidJsonError',
        message: `Invalid JSON in ${filename}`,
        type: 'INVALID_FORMAT',
        filename,
      } as ZipError;
    }
  });
}

/**
 * Extracts text content from a file in the ZIP archive
 * @param zip - JSZip instance
 * @param filename - Name of the text file in the ZIP
 * @returns The text content
 */
export async function getTextFromZip(zip: JSZip, filename: string): Promise<string> {
  return safeZipOperation(async () => {
    const file = zip.file(filename);
    if (!file) {
      throw {
        name: 'FileNotFoundError',
        message: `File ${filename} not found in ZIP`,
        type: 'FILE_NOT_FOUND',
        filename,
      } as ZipError;
    }
    return await file.async('text');
  });
}

/**
 * Extracts binary data from a file in the ZIP archive
 * @param zip - JSZip instance
 * @param filename - Name of the binary file in the ZIP
 * @returns Uint8Array containing the binary data
 */
export async function getBinaryFromZip(
  zip: JSZip,
  filename: string,
): Promise<Uint8Array> {
  return safeZipOperation(async () => {
    const file = zip.file(filename);
    if (!file) {
      throw {
        name: 'FileNotFoundError',
        message: `File ${filename} not found in ZIP`,
        type: 'FILE_NOT_FOUND',
        filename,
      } as ZipError;
    }
    return await file.async('uint8array');
  });
}

/**
 * Creates an object URL for a file in the ZIP (useful for media files)
 * @param zip - JSZip instance
 * @param filename - Name of the file in the ZIP
 * @param mimeType - Optional MIME type override
 * @returns Object URL that can be used as src for media elements
 */
export async function createObjectUrlFromZip(
  zip: JSZip,
  filename: string,
  mimeType?: string,
): Promise<string> {
  return safeZipOperation(async () => {
    const file = zip.file(filename);
    if (!file) {
      throw {
        name: 'FileNotFoundError',
        message: `File ${filename} not found in ZIP`,
        type: 'FILE_NOT_FOUND',
        filename,
      } as ZipError;
    }

    // Use caching based on filename and last modified time
    const cacheKey = `${filename}_${file.date.getTime()}`;
    if (objectUrlCache.has(cacheKey)) {
      return objectUrlCache.get(cacheKey)!;
    }

    // Check cache size and evict oldest if needed (LRU policy)
    if (objectUrlCache.size >= MAX_OBJECT_URL_CACHE_SIZE) {
      const oldestKey = objectUrlCache.keys().next().value;
      if (oldestKey) {
        const oldUrl = objectUrlCache.get(oldestKey);
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
        objectUrlCache.delete(oldestKey);
      }
    }

    // Create and cache the object URL
    const blob = await file.async('blob');
    const finalBlob = mimeType ? new Blob([blob], { type: mimeType }) : blob;
    const url = URL.createObjectURL(finalBlob);
    objectUrlCache.set(cacheKey, url);
    return url;
  });
}

/**
 * Revokes an object URL created by createObjectUrlFromZip
 * @param url - The object URL to revoke
 */
export function revokeObjectUrl(url: string): void {
  if (objectUrlCache.has(url)) {
    URL.revokeObjectURL(url);
    objectUrlCache.delete(url);
  }
}

/**
 * Creates a new ZIP file from provided content
 * @param files - Object mapping filenames to content
 * @param options - ZIP creation options
 * @returns Promise resolving to the ZIP file as Blob
 */
export async function createZipFile(
  files: ZipFileContent,
  options: CreateZipOptions = {},
): Promise<Blob> {
  return safeZipOperation(async () => {
    const zip = new JSZip();

    // Add each file to the ZIP
    Object.entries(files).forEach(([filename, content]) => {
      if (typeof content === 'object' && !(content instanceof Blob)) {
        // Stringify JSON objects
        zip.file(filename, JSON.stringify(content, null, 2), {
          compression: options.compression || 'DEFLATE',
        });
      } else {
        // Add other content as-is
        zip.file(filename, content, {
          compression: options.compression || 'DEFLATE',
        });
      }
    });

    // Generate the ZIP file
    return await zip.generateAsync({
      type: 'blob',
      compression: options.compression || 'DEFLATE',
      comment: options.comment,
    });
  });
}

/**
 * Checks if all required files exist in the ZIP archive
 * @param zip - JSZip instance
 * @param requiredFiles - Array of filenames to check
 * @returns true if all files exist
 */
export function checkRequiredFiles(zip: JSZip, requiredFiles: string[]): boolean {
  return requiredFiles.every((file) => zip.file(file));
}

/**
 * Clears all caches (ZIP files and object URLs)
 */
export function clearCache(): void {
  zipCache.clear();
  objectUrlCache.forEach((url) => URL.revokeObjectURL(url));
  objectUrlCache.clear();
}

/**
 * Extracts entire ZIP contents to a directory-like structure
 * @param zip - JSZip instance
 * @returns Object representing the directory structure with file contents
 */
export async function extractZipToDirectoryStructure(
  zip: JSZip,
): Promise<Record<string, any>> {
  return safeZipOperation(async () => {
    const structure: Record<string, any> = {};
    const fileProcessors: Promise<void>[] = [];

    // Process each file in the ZIP
    Object.keys(zip.files).forEach((filename) => {
      const file = zip.files[filename];

      if (file.dir) {
        // Create directory entry
        structure[filename] = {};
      } else {
        // Process file based on its type
        const processor = (async () => {
          try {
            if (filename.endsWith('.json')) {
              structure[filename] = await getJsonFromZip(zip, filename);
            } else if (filename.match(/\.(txt|html|css|js|md)$/i)) {
              structure[filename] = await getTextFromZip(zip, filename);
            } else if (isMediaFile(filename)) {
              structure[filename] = await createObjectUrlFromZip(
                zip,
                filename,
                getMimeType(filename),
              );
            } else {
              structure[filename] = await getBinaryFromZip(zip, filename);
            }
          } catch (error) {
            console.error(`Error processing ${filename}:`, error);
            structure[filename] = null;
          }
        })();
        fileProcessors.push(processor);
      }
    });

    // Wait for all files to be processed
    await Promise.all(fileProcessors);
    return structure;
  });
}
// normal extractZip
/**
 * ดาวน์โหลดและแตกไฟล์ ZIP ที่มีโมเดล FBX
 * @param zipUrl - URL ของไฟล์ ZIP
 * @returns Promise ที่ resolve กับ object ที่มี modelUrl และ textures
 */
export const extractFBXFromZip = async (zipUrl: string): Promise<ExtractedFBXModel> => {
  try {
    const response = await fetch(zipUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const zipBlob = await response.blob();
    const zip = await JSZip.loadAsync(zipBlob);

    const fbxFile = Object.keys(zip.files).find((file) =>
      file.toLowerCase().endsWith('.fbx'),
    );

    if (!fbxFile) {
      throw new Error('No FBX file found in the ZIP');
    }

    const fbxBlob = await zip.file(fbxFile)!.async('blob');
    const modelUrl = URL.createObjectURL(fbxBlob);

    const textureFiles = Object.keys(zip.files).filter((file) =>
      /\.(png|jpg|jpeg|bmp|tga)$/i.test(file),
    );

    const textures = await Promise.all(
      textureFiles.map(async (file) => {
        const textureBlob = await zip.file(file)!.async('blob');
        return {
          name: file,
          url: URL.createObjectURL(textureBlob),
        };
      }),
    );
    return {
      modelUrl,
      textures,
      metadata: {
        originalZipUrl: zipUrl,
        extractedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Error extracting FBX from ZIP:', error);
    throw error;
  }
};
