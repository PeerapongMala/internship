export type TLessonMeta = {
  subject_id: number;
  subject_name: string;
  subject_group_id: number;
  subject_group_name: string;
  year_id: number;
  year_name: string;
  lesson_count: number;
  sub_lesson_count: number;
  lessons: Lesson[];
};

type Lesson = {
  lesson_id: number;
  sub_lesson_count: number;
};

export type TLessonMetaReq = {
  lesson_ids: number[];
};
