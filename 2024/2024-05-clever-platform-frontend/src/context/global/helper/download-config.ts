/**
 * Download Configuration
 * อ่านค่าจาก StoreGlobalPersist (Zustand store)
 * สามารถปรับค่าได้จาก Settings UI และจะถูก persist อัตโนมัติ
 */

import { DownloadConfig } from '@domain/g03/g03-d10/g03-d10-p01-setting/type';
import StoreGlobalPersist from '@store/global/persist';

/**
 * 🔧 ค่า Preset Configurations (สำหรับใช้ด่วนๆ)
 */

/** 🐢 Ultra Slow - สำหรับอุปกรณ์ RAM 2GB (ปลอดภัยที่สุด) */
export const ULTRA_SLOW_PRESET: DownloadConfig = {
  sublessonConcurrency: 1, // ทีละ 1 sublesson
  sublessonDelay: 100, // รอ 100ms ระหว่าง sublesson
  levelDelay: 50, // รอ 50ms ระหว่าง level
  questionDelay: 100, // รอ 100ms ระหว่าง question
  assetConcurrency: 1, // ทีละ 1 asset
};

/** 🐌 Slow - ช้าที่สุด (ปลอดภัยที่สุด) */
export const SLOW_PRESET: DownloadConfig = {
  sublessonConcurrency: 3,
  sublessonDelay: 60,
  levelDelay: 30,
  questionDelay: 55,
  assetConcurrency: 4,
};

/** ⚙️ Normal - ปกติ (แนะนำ) */
export const NORMAL_PRESET: DownloadConfig = {
  sublessonConcurrency: 5,
  sublessonDelay: 20,
  levelDelay: 10,
  questionDelay: 10,
  assetConcurrency: 5,
};

/** 🚀 Fast - เร็ว (ใกล้ turbo) */
export const FAST_PRESET: DownloadConfig = {
  sublessonConcurrency: 8,
  sublessonDelay: 0,
  levelDelay: 0,
  questionDelay: 0,
  assetConcurrency: 8,
};

/** ⚡ Turbo - เร็วที่สุด (ระวัง: อาจใช้ memory สูง) */
export const TURBO_PRESET: DownloadConfig = {
  sublessonConcurrency: 15,
  sublessonDelay: 0,
  levelDelay: 0,
  questionDelay: 0,
  assetConcurrency: 15,
};

/**
 * ดึงค่า download configuration จาก store
 * ค่านี้จะถูก persist ใน localStorage อัตโนมัติ
 */
export function getDownloadConfig(): DownloadConfig {
  const settings = StoreGlobalPersist.MethodGet().getSettings();
  return settings.downloadConfig;
}

/**
 * ตั้งค่า download configuration ใหม่
 * จะถูก persist ใน localStorage อัตโนมัติ
 */
export function setDownloadConfig(config: Partial<DownloadConfig>): void {
  const currentSettings = StoreGlobalPersist.MethodGet().getSettings();
  StoreGlobalPersist.MethodGet().updateSettings({
    downloadConfig: {
      ...currentSettings.downloadConfig,
      ...config,
    },
  });
}

/**
 * ใช้ค่า preset ที่กำหนดไว้
 *
 * @example
 * ```typescript
 * // ใช้ค่า ultra-slow preset (สำหรับ RAM 2GB)
 * applyPreset('ultra-slow');
 * // ใช้ค่า normal preset
 * applyPreset('normal');
 * // ใช้ค่า fast preset
 * applyPreset('fast');
 * ```
 */
export function applyPreset(
  preset: 'ultra-slow' | 'slow' | 'normal' | 'fast' | 'turbo',
): void {
  let config: DownloadConfig;
  switch (preset) {
    case 'ultra-slow':
      config = ULTRA_SLOW_PRESET;
      break;
    case 'slow':
      config = SLOW_PRESET;
      break;
    case 'normal':
      config = NORMAL_PRESET;
      break;
    case 'fast':
      config = FAST_PRESET;
      break;
    case 'turbo':
      config = TURBO_PRESET;
      break;
    default:
      config = NORMAL_PRESET;
      break;
  }
  setDownloadConfig(config);
}

/**
 * รีเซ็ตกลับเป็นค่า default (Normal - ปกติ แนะนำ)
 */
export function resetToDefault(): void {
  setDownloadConfig(NORMAL_PRESET);
}

/**
 * แสดงค่า config ปัจจุบันใน console (สำหรับ debug)
 */
export function logDownloadConfig(): void {
  const config = getDownloadConfig();
  const estimatedSpeed =
    config.sublessonConcurrency === 1 &&
    config.sublessonDelay === 200 &&
    config.levelDelay === 100 &&
    config.questionDelay === 150
      ? '1x (slow) 🐌'
      : config.sublessonConcurrency === 2 &&
          config.sublessonDelay === 100 &&
          config.levelDelay === 50 &&
          config.questionDelay === 75
        ? '~2x (normal) ⚙️'
        : config.sublessonConcurrency === 3 &&
            config.sublessonDelay >= 55 &&
            config.sublessonDelay <= 65
          ? '~3-4x (fast) 🚀'
          : config.sublessonConcurrency >= 3
            ? '~4-5x (turbo) ⚡⚡'
            : '~2-3x (custom) ⚙️';

  console.log('📦 Download Configuration:', {
    config,
    estimatedSpeed,
    stored: 'StoreGlobalPersist (auto-saved)',
  });
}
