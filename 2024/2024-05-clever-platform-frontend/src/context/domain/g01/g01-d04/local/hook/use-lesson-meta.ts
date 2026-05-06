import API from '@domain/g01/g01-d04/local/api';
import { TLessonMeta } from '@domain/g01/g01-d04/local/types/lesson-meta';
import { LessonEntity } from '@domain/g04/g04-d01/local/type';
import StoreLessons from '@store/global/lessons'; // 👈 ใช้ Store เดิม
import { useCallback, useEffect, useMemo } from 'react';

export const useLessonData = () => {
  const { store: lessonsStore } = StoreLessons.StateGet(['store']);

  const { lessonMeta: lessonDataAPI } = StoreLessons.StateGet(['lessonMeta']);
  // const { lessonDataAPI } = StoreLessons.StateGet(['lessonMeta']) as {
  //   lessonDataAPI: TLessonMeta[];
  // };

  const lessonCount = Object.keys(lessonsStore).length;

  const fetchLessonMeta = useCallback(async () => {
    const lessons = Object.values(lessonsStore).filter(Boolean) as LessonEntity[];
    const lessonIds = lessons.map((lesson) => lesson.id);

    // ถ้าไม่มี lesson เลย ไม่ต้องยิง API
    if (lessonIds.length === 0) {
      console.log('⏭️ No lessons to fetch metadata for');
      return [];
    }

    // ตรวจสอบว่า lesson ทั้งหมดมี metadata ใน store แล้วหรือไม่
    const existingLessonIds = new Set(
      lessonDataAPI.flatMap((meta: TLessonMeta) => meta.lessons.map((l) => l.lesson_id)),
    );

    const allLessonsHaveMetadata = lessonIds.every((id) => existingLessonIds.has(id));

    // ถ้าทุก lesson มี metadata ใน store แล้ว ไม่ต้องยิง API
    if (allLessonsHaveMetadata) {
      console.log('⏭️ Using cached lesson meta from store (no API call needed)');
      return lessonDataAPI;
    }

    // ถ้ายังไม่มี metadata ครบหรือมี lesson ใหม่ ถึงค่อยยิง API
    try {
      const res = await API.Upload.GetLessonMeta({ lesson_ids: lessonIds });
      console.log('✅ Fetched lesson meta from API:', res.data);

      StoreLessons.MethodGet().setLessonMeta(res.data as TLessonMeta[]);

      return res.data;
    } catch (err) {
      console.error('❌ Error fetching lesson meta:', err);
      return lessonDataAPI; // คืนข้อมูลที่มีใน store ถ้า API error
    }
  }, [lessonsStore, lessonDataAPI]);

  useEffect(() => {
    fetchLessonMeta();
  }, [lessonCount]);

  const lessonMapping = useMemo(() => {
    const lessons = Object.values(lessonsStore).filter(Boolean) as LessonEntity[];
    const mapping = new Map<number, LessonEntity>();
    lessons.forEach((lesson) => {
      if (typeof lesson.id === 'number') {
        mapping.set(lesson.id, lesson);
      }
    });
    return mapping;
  }, [lessonsStore]);

  return { lessonDataAPI, lessonMapping, refreshLessons: fetchLessonMeta };
};
