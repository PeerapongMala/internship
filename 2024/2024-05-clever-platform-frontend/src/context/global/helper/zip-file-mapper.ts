/**
 * 🗺️ ZIP File Mapper Utility
 *
 * แปลง URL ของ media file เป็นชื่อไฟล์ใน ZIP archive
 *
 * Pattern:
 *   URL:       https://testcloud.online/cp-prod/d66dfb43-48c1-49c2-a283-58c3168aa603
 *   Filename:  testcloud.online_cp-prod_d66dfb43-48c1-49c2-a283-58c3168aa603.mp3
 *
 * การแปลง:
 *   1. ลบ protocol (https://)
 *   2. แทนที่ / ด้วย _
 *   3. เพิ่มนามสกุล .mp3 หรือ .png
 */

export type MediaFileType = 'image' | 'audio' | 'unknown';

/**
 * กำหนดประเภทไฟล์จาก URL หรือ context
 */
export function detectMediaType(url: string, context?: 'image' | 'audio'): MediaFileType {
  if (context) return context;

  // ลองดูจาก URL path (บางครั้งอาจมี hint)
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.includes('.png') ||
    lowerUrl.includes('.jpg') ||
    lowerUrl.includes('.jpeg') ||
    lowerUrl.includes('.gif') ||
    lowerUrl.includes('.webp')
  ) {
    return 'image';
  }
  if (
    lowerUrl.includes('.mp3') ||
    lowerUrl.includes('.wav') ||
    lowerUrl.includes('.ogg') ||
    lowerUrl.includes('.m4a')
  ) {
    return 'audio';
  }

  return 'unknown';
}

/**
 * กำหนด extension จากประเภทไฟล์
 */
export function getExtensionForType(type: MediaFileType): string {
  switch (type) {
    case 'image':
      return '.png';
    case 'audio':
      return '.mp3';
    default:
      return '';
  }
}

/**
 * แปลง URL เป็นชื่อไฟล์ที่ใช้ใน ZIP
 *
 * @param url - URL ของไฟล์ เช่น https://testcloud.online/cp-prod/uuid
 * @param mediaType - ประเภทไฟล์ ('image' หรือ 'audio')
 * @returns ชื่อไฟล์ใน ZIP เช่น testcloud.online_cp-prod_uuid.mp3
 */
export function urlToZipFilename(
  url: string,
  mediaType: MediaFileType = 'unknown',
): string {
  if (!url) return '';

  try {
    // ลบ protocol (https:// หรือ http://)
    let filename = url.replace(/^https?:\/\//, '');

    // แทนที่ / ด้วย _
    filename = filename.replace(/\//g, '_');

    // เพิ่ม extension ตาม type
    const extension = getExtensionForType(mediaType);
    if (extension && !filename.toLowerCase().endsWith(extension)) {
      filename += extension;
    }

    return filename;
  } catch (e) {
    console.error('Error converting URL to ZIP filename:', e);
    return '';
  }
}

/**
 * แปลงชื่อไฟล์ใน ZIP กลับเป็น URL
 *
 * @param filename - ชื่อไฟล์ใน ZIP เช่น testcloud.online_cp-prod_uuid.mp3
 * @returns URL เช่น https://testcloud.online/cp-prod/uuid
 */
export function zipFilenameToUrl(filename: string): string {
  if (!filename) return '';

  try {
    // ลบ extension
    let url = filename.replace(/\.(mp3|png|jpg|jpeg|gif|webp|wav|ogg|m4a)$/i, '');

    // แปลง _ กลับเป็น /
    // NOTE: ต้องระวัง domain part ที่ควรเป็น / ตัวแรก
    // Pattern: domain.com_path_to_file → domain.com/path/to/file
    const parts = url.split('_');
    if (parts.length > 0) {
      // ส่วนแรกคือ domain (เช่น testcloud.online)
      const domain = parts[0];
      // ส่วนที่เหลือคือ path
      const path = parts.slice(1).join('/');
      url = `https://${domain}/${path}`;
    }

    return url;
  } catch (e) {
    console.error('Error converting ZIP filename to URL:', e);
    return '';
  }
}

/**
 * Interface สำหรับ extracted media files จาก ZIP
 *
 * NOTE: ZIP มีเฉพาะไฟล์ภาพ (image) เท่านั้น
 * ไฟล์เสียง (audio) จะดาวน์โหลดแยกต่างหากผ่าน downloadAudioFiles()
 */
export interface ExtractedZipMedia {
  /** Map จาก URL → base64 data */
  byUrl: Map<string, string>;
  /** Map จากชื่อไฟล์ใน ZIP → base64 data */
  byFilename: Map<string, string>;
  /** จำนวนไฟล์ที่ extract ได้ */
  fileCount: number;
  /** จำนวนไฟล์ภาพ */
  imageCount: number;
}

/**
 * สร้าง ExtractedZipMedia เปล่า
 */
export function createEmptyZipMedia(): ExtractedZipMedia {
  return {
    byUrl: new Map(),
    byFilename: new Map(),
    fileCount: 0,
    imageCount: 0,
  };
}

/**
 * ค้นหา media data จาก URL หรือ filename
 *
 * @param zipMedia - ExtractedZipMedia ที่ได้จากการ extract ZIP
 * @param url - URL ของไฟล์ที่ต้องการ
 * @param mediaType - ประเภทไฟล์
 * @returns base64 data หรือ undefined ถ้าไม่พบ
 */
export function findMediaInZip(
  zipMedia: ExtractedZipMedia | undefined,
  url: string,
  mediaType: MediaFileType = 'unknown',
): string | undefined {
  if (!zipMedia || !url) return undefined;

  // 1. ลองหาจาก URL ตรงๆ
  if (zipMedia.byUrl.has(url)) {
    return zipMedia.byUrl.get(url);
  }

  // 2. ลองแปลง URL เป็น filename แล้วหา
  const filename = urlToZipFilename(url, mediaType);
  if (filename && zipMedia.byFilename.has(filename)) {
    return zipMedia.byFilename.get(filename);
  }

  // 3. ลองหาแบบ fuzzy (ignore extension)
  const filenameNoExt = filename.replace(/\.[^/.]+$/, '');
  for (const [zipFilename, data] of zipMedia.byFilename.entries()) {
    const zipNoExt = zipFilename.replace(/\.[^/.]+$/, '');
    if (zipNoExt === filenameNoExt) {
      return data;
    }
  }

  return undefined;
}

/**
 * Debug: แสดงรายการไฟล์ทั้งหมดใน ExtractedZipMedia
 */
export function debugLogZipMedia(zipMedia: ExtractedZipMedia, label?: string): void {
  console.log(`📦 ${label || 'ZIP Media Contents'}:`, {
    fileCount: zipMedia.fileCount,
    imageCount: zipMedia.imageCount,
    filenames: Array.from(zipMedia.byFilename.keys()).slice(0, 10), // แสดงแค่ 10 ตัวแรก
  });
}
