import StoreGlobalPersist from '@store/global/persist';

export function getLesson(): TStoreLessonData[] | null {
  const { lessonData }: { lessonData: TStoreLessonData[] | null } =
    StoreGlobalPersist.StateGet(['lessonData']);

  return lessonData;
}
