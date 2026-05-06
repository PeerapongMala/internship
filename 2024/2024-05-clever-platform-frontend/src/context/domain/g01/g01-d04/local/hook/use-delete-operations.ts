import { SublessonEntity } from '@domain/g04/g04-d01/local/type';
import { StoreModelFileMethods } from '@store/global/avatar-models';
import StoreLessonFile from '@store/global/lesson-files';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import StoreSublessons from '@store/global/sublessons';
import { useRef } from 'react';

export const useDeleteOperations = () => {
  // 🔒 DELETION MUTEX: Prevent overlapping deletion operations
  // This prevents race conditions and crashes when user deletes multiple lessons quickly
  const deletionInProgressRef = useRef(false);
  const deleteModel = async (modelKey: string): Promise<void> => {
    await StoreModelFileMethods.removeItem(modelKey);
    console.log(`✅ ลบโมเดล ${modelKey} สำเร็จ`);
  };

  const deleteLesson = async (lessonId: number): Promise<boolean> => {
    // 🔒 MUTEX CHECK: Prevent overlapping deletions
    if (deletionInProgressRef.current) {
      console.warn('⚠️ Deletion already in progress, please wait...');
      return false;
    }

    try {
      // 🔒 Lock the deletion mutex
      deletionInProgressRef.current = true;

      // Step 1: Clear downloaded content (sublessons, levels, assets, monsters)
      const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);

      // 📱 PLATFORM DETECTION: Adjust deletion speed based on device capabilities
      // Mobile devices have less memory and slower GC, so we delete slower

      const CHUNK_SIZE = 1;
      const DELAY_MS = 300;

      for (let i = 0; i < sublessons.length; i += CHUNK_SIZE) {
        const chunk = sublessons.slice(i, i + CHUNK_SIZE);

        // Delete chunk
        chunk.forEach((sublesson: SublessonEntity) => {
          StoreSublessons.MethodGet().remove(sublesson.id);
        });

        console.log(
          `🗑️ ลบ chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(sublessons.length / CHUNK_SIZE)} (${chunk.length} รายการ)`,
        );

        // Add delay between chunks (except for last chunk)
        if (i + CHUNK_SIZE < sublessons.length) {
          await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
        }
      }

      console.log(`✅ ลบ sublessons ทั้งหมดเสร็จสิ้น`);

      // Defensive cleanup: Remove any orphan levels
      StoreLevel.MethodGet().removeLevelsForLesson(String(lessonId));

      // Remove assets
      StoreLessonFile.MethodGet().removeAllByLessonId(String(lessonId));

      // Remove monsters
      StoreLessons.MethodGet().removeMonsters(lessonId);

      // Step 2: Clear download progress flag
      StoreLessons.MethodGet().setDownloadInProgress(lessonId, false);

      // Step 3: Remove lesson metadata (optional)

      const lessonEntity = StoreLessons.MethodGet().get(lessonId);
      if (lessonEntity?.subject_id) {
        StoreLessons.MethodGet().removeLessonMetaBySubjectId(lessonEntity.subject_id);
      }

      // Step 4: Remove lesson from store
      StoreLessons.MethodGet().remove(lessonId);

      console.log(`✅ ลบบทเรียน ID: ${lessonId} สำเร็จ`);
      return true;
    } catch (error) {
      console.error(`❌ ลบบทเรียน ID: ${lessonId} ไม่สำเร็จ:`, error);
      return false;
    } finally {
      // 🔒 CRITICAL: Always unlock mutex in finally block
      // This ensures we can retry deletion even if previous attempt failed
      deletionInProgressRef.current = false;
    }
  };

  const deleteSublesson = async (subLessonId: number): Promise<boolean> => {
    try {
      // Step 1: Clear downloaded content (sublessons, levels, assets, monsters)

      StoreSublessons.MethodGet().remove(subLessonId);

      console.log(`✅ ลบบทเรียน ID: ${subLessonId} สำเร็จ`);
      return true;
    } catch (error) {
      console.error(`❌ ลบบทเรียน ID: ${subLessonId} ไม่สำเร็จ:`, error);
      return false;
    }
  };

  const deleteLessons = async (
    lessonIds: number[],
  ): Promise<{ successCount: number; failCount: number }> => {
    console.log(`🗑️ กำลังลบบทเรียน ${lessonIds.length} รายการ...`);

    let successCount = 0;
    let failCount = 0;

    // 📱 PLATFORM DETECTION: Add delay between lessons on mobile
    const LESSON_DELAY_MS = 200; // Extra delay between lessons

    for (let i = 0; i < lessonIds.length; i++) {
      const lessonId = lessonIds[i];
      const success = await deleteLesson(lessonId);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      // Add delay between lessons to prevent memory pressure
      // Skip delay after last lesson
      if (i < lessonIds.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, LESSON_DELAY_MS));
        console.log(`⏳ Waiting ${LESSON_DELAY_MS}ms before next deletion...`);
      }
    }

    console.log(`📊 สรุปการลบ: สำเร็จ ${successCount}/${lessonIds.length}`);
    return { successCount, failCount };
  };

  return {
    deleteModel,
    deleteLesson,
    deleteLessons,
    deleteSublesson,
  };
};
