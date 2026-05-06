import testlogoMonster from '../local/assets/test.png';
import testMap from '../local/assets/testmap.jpg';

export enum LessonStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
  USE_ALL = 'enabled',
}

export enum LevelType {
  TEST = 'test',
  PRETEST = 'pre-post-test',
  POSTTEST = 'sub-lesson-post-test',
}
export enum SubjectType {
  MATH = 'math',
  ENG = 'eng',
  CHINESE = 'chinese',
  SCIENCE = 'science',
}

export interface BulkEditItem {
  lessonsId?: number;
  status: LessonStatus;
}

export interface IBulkEdit {
  bulk_edit_list: BulkEditItem[];
  admin_login_as?: string;
}

export interface Monster {
  id: number;
  name?: string;
  name_model?: string;
  image_path?: string;
  lesson_id?: number;
  level_type?: LevelType;
  available_for: LevelType[];
}

export const MonsterData: Monster[] = [
  {
    id: 1,
    image_path: 'มอนเตอร์จ้า',
    lesson_id: 1,
    level_type: LevelType.TEST,
    available_for: [LevelType.TEST],
  },
  {
    id: 2,
    image_path: 'ราชินีดอกไม้',
    lesson_id: 1,
    level_type: LevelType.TEST,
    available_for: [LevelType.TEST],
  },
  {
    id: 3,
    image_path: 'ราชินีมด',
    lesson_id: 1,
    level_type: LevelType.TEST,
    available_for: [LevelType.TEST],
  },
  {
    id: 4,
    image_path: 'ราชินีผึ้ง',
    lesson_id: 1,
    level_type: LevelType.TEST,
    available_for: [LevelType.TEST],
  },
];

export interface Map {
  id: number;
  map_name: string;
  image_path: string;
  level_type?: string;
  seed_subject_group_id?: number;
  available_for: SubjectType[];
}

export interface Level {
  levelId: string;
  levelName: string;
  tier: string;
}

export interface Sublesson {
  sublessonsId: string;
  sublessonsName: string;
  typeQuestion: string;
  level: Level[];
}

export interface Lesson {
  id: number;
  name: string;
  status: string;
  // checkpoint: string;
  // sublessons: Sublesson[];
}

export interface IPagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface Data {
  subjectId: string;
  lessonCode: string;
  course: string;
  subjectName: string;
  year: string;
  usedStatus: string;
  lastUpdated: Date;
  lastUpdatedBy: string;
  lessons: Lesson[];
}

export interface IDownloadCsvFilter {
  start_date: string;
  end_date: string;
  curriculum_group_id?: number;
  subject_id?: number;
}

export interface SubjectLessons {
  id: number | undefined;
  subject_id: number;
  subject_name: string;
  year_id: number;
  year_name: string;
  sub_lesson_count: number;
  index: number;
  name: string;
  rewarded_stage_count?: number;
  font_name: string;
  font_size: string;
  background_image_path: string;
  status: LessonStatus;
  wizard_index: number;
  created_at: string; // ISO 8601 string format
  created_by: string; // User ID or identifier
  updated_at: string; // ISO 8601 string format
  updated_by: string; // User ID or name of the person who last updated
  admin_login_as: string; // Admin user ID for login as
}

export interface ResponseSubjectLessons {
  data: SubjectLessons[];
  message: string;
  status_code: number;
  _pagination: {
    limit: number;
    page: number;
    total_count: number;
  };
}

export const DataTest: Data[] = [];

export interface Platform {
  id: number;
  curriculum_group_id: number;
  seed_platform_name: string;
  seed_platform_id: number;
  status: 'enabled' | 'disabled';
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  admin_login_as: string | null;
  subjects: [];
}

export type TLessonBulkEditBody = {
  password: string;
  bulk_edit_list: {
    lesson_id: number; // required, ID ของด่าน
    status: LessonStatus.USE_ALL; // required, สถานะ (enabled)
  }[];
};
