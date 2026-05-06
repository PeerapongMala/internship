import { ErrorItem } from '@component/web/molecule/cw-error-list';
import { UploadMode } from '@component/web/molecule/cw-modal-confirm-upload';
import { processUploadedModel } from '@global/helper/model-upload';
import { processUploadedSublesson } from '@global/helper/upload';
import { StoreModelFileMethods } from '@store/global/avatar-models';
import StoreSublessons from '@store/global/sublessons';
import { useRef, useState } from 'react';

interface UploadResult {
  successCount: number;
  failCount: number;
  errors: ErrorItem[];
}

export const useUploadOperations = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  // 🔒 Race condition protection
  const isUploadingRef = useRef(false);

  const uploadFiles = async (
    files: File[],
    uploadMode: UploadMode,
    preferredLanguage: string,
  ): Promise<UploadResult> => {
    // 🔒 Race condition protection - check ref before proceeding
    if (isUploadingRef.current) {
      console.warn('⚠️ Upload already in progress (blocked by ref lock)');
      return { successCount: 0, failCount: 0, errors: [] };
    }

    console.log(`\n🚀 อัปโหลด ${files.length} ไฟล์สำหรับ ${uploadMode}`);
    console.log('='.repeat(80));

    setTotalFiles(files.length);
    setCurrentFileIndex(0);
    setUploadProgress(0);
    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;
    const errors: ErrorItem[] = [];

    try {
      // 🔒 Acquire lock immediately
      isUploadingRef.current = true;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileIndex(i + 1);
        console.log(`\n📦 กำลังประมวลผลไฟล์ที่ ${i + 1}/${files.length}: ${file.name}`);

        try {
          // Check duplicates
          const isDuplicate = await checkDuplicate(file, uploadMode);
          if (isDuplicate) {
            failCount++;
            console.warn(`⚠️ ไฟล์มีอยู่แล้ว: ${file.name}`);
            errors.push({
              id: `error-${i}`,
              filename: file.name,
              message: 'ไฟล์นี้มีในระบบแล้ว',
              type: 'error',
            });
            continue;
          }

          // Process upload
          const result = await processFile(
            file,
            uploadMode,
            preferredLanguage,
            (progress) => {
              const overallProgress = Math.floor(
                ((i + progress / 100) / files.length) * 100,
              );
              setUploadProgress(overallProgress);
            },
          );

          if (result.success) {
            successCount++;
            console.log(`✅ สำเร็จ: ${file.name}`);
            logSuccessDetails(result, uploadMode);

            // Set 100% for this file
            const fileCompleteProgress = Math.floor(((i + 1) / files.length) * 100);
            setUploadProgress(fileCompleteProgress);
          } else {
            failCount++;
            console.error(`❌ ล้มเหลว: ${file.name}`);
            console.error(`   Error: ${result.error}`);

            const isDuplicateError = result.error
              ?.toLowerCase()
              .includes('already exists');
            errors.push({
              id: `error-${i}`,
              filename: file.name,
              message: isDuplicateError ? 'ไฟล์นี้มีในระบบแล้ว' : 'อัปโหลดไม่สำเร็จ',
              type: 'error',
            });
          }
        } catch (error) {
          failCount++;
          console.error(`❌ ไม่สามารถประมวลผลไฟล์ ${file.name}:`, error);
          errors.push({
            id: `error-${i}`,
            filename: file.name,
            message: 'อัปโหลดไม่สำเร็จ',
            type: 'error',
          });
        }

        // Don't reset progress to 0 here - keep showing completion
        if (i < files.length - 1) {
          console.log('\n' + '='.repeat(80));
        }
      }

      logUploadSummary(successCount, failCount, files.length);
      return { successCount, failCount, errors };
    } finally {
      // 🔒 Always release lock
      isUploadingRef.current = false;
      setIsUploading(false);
    }
  };

  const resetProgress = () => {
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setTotalFiles(0);
  };

  return {
    isUploading,
    uploadProgress,
    currentFileIndex,
    totalFiles,
    uploadFiles,
    resetProgress,
  };
};

// Helper functions
async function checkDuplicate(file: File, uploadMode: UploadMode): Promise<boolean> {
  if (uploadMode === 'model') {
    const modelKey = file.name.replace(/\.zip$/i, '');
    const existingModel = await StoreModelFileMethods.getItem(modelKey);
    return existingModel !== null;
  } else if (uploadMode === 'sublesson') {
    // Extract sublessonId from nested ZIP to check if complete sublesson already exists
    try {
      const { extractJsonFromZipFile } = await import('@global/helper/upload');
      const { mainIndexJson } = await extractJsonFromZipFile(file);
      const sublessonId =
        mainIndexJson.meta?.sub_lesson_id ?? mainIndexJson.sub_lesson_id;

      if (sublessonId) {
        // Use isSublessonComplete for smart duplicate detection
        const isComplete = StoreSublessons.MethodGet().isSublessonComplete(sublessonId);
        return isComplete;
      }
    } catch (error) {
      console.warn('⚠️ Failed to extract sublesson ID for duplicate check:', error);
      // If we can't extract, let processUploadedSublesson handle it
    }
  }
  return false;
}

async function processFile(
  file: File,
  uploadMode: UploadMode,
  preferredLanguage: string,
  onProgress: (progress: number) => void,
) {
  if (uploadMode === 'model') {
    return await processUploadedModel(file, onProgress);
  } else {
    // For sublesson, wrap processUploadedSublesson with Store progress tracking
    const result = await processUploadedSublesson(file, preferredLanguage, (progress) => {
      // Update both local state and Store state
      onProgress(progress);

      // Note: The actual Store state is set inside upload.ts where sublessonId is available
    });

    // Don't clear upload state - keep it to show "Upload completed" status
    // The state will be cleared when:
    // 1. User deletes the sublesson
    // 2. User re-uploads the same sublesson

    return result;
  }
}

function logSuccessDetails(result: any, uploadMode: UploadMode) {
  // if (uploadMode === 'model') {
  //   console.log(`   Model Key: ${result.modelKey}`);
  // } else {
  //   console.log(`   Lesson ID: ${result.lessonId}`);
  //   console.log(`   Sublesson ID: ${result.sublessonId}`);
  //   console.log(`   Levels: ${result.levelCount}`);
  //   console.log(`   Questions: ${result.questionCount}`);
  // }
}

function logUploadSummary(successCount: number, failCount: number, totalCount: number) {
  // console.log('\n' + '='.repeat(80));
  // console.log(`📊 สรุปผลการอัปโหลด:`);
  // console.log(`   ✅ สำเร็จ: ${successCount} ไฟล์`);
  // console.log(`   ❌ ล้มเหลว: ${failCount} ไฟล์`);
  // console.log(`   📁 รวมทั้งหมด: ${totalCount} ไฟล์`);
  // console.log('='.repeat(80) + '\n');
}
