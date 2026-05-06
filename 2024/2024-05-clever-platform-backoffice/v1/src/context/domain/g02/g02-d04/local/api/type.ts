import testlogoMonster from '../../local/assets/test.png';
import testMap from '../../local/assets/testmap.jpg';

export enum LessonStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
  USE_ALL = 'enabled',
}
export interface Curriculum {
  id: number;
  name?: string;
  short_name?: string;
  status?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}
export interface Monster {
  id: number;
  MonsterName: string;
  image: string;
  tier: string;
}
export interface Map {
  id: number;
  MapName: string;
  image: string;
}
export interface Level {
  levelId: string;
  levelName: string;
  tier: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface IDownloadCsvFilter {
  start_date: string;
  end_date: string;
  lesson_id?: number;
}

export interface BulkEditItem {
  sub_lesson_id?: number;
  status: LessonStatus;
}

export interface IBulkEdit {
  bulk_edit_list: BulkEditItem[];
  admin_login_as?: string;
}

export interface Sublesson {
  sublessonsId: string;
  sublessonsName: string;
  typeQuestion: string;
  level: Level[];
}

export interface Lesson {
  lessonsId: string;
  lessonsName: string;
  checkpoint: string;
  sublessons: Sublesson[];
}

export interface Subject {
  subjectId: string;
  lessonCode: string;
  course: string;
  subjectName: string;
  year: string;
  usedStatus: string;
  lastUpdated: Date;
  lastUpdatedBy: string;
  indicatorId: string;
  indicatorName: string;
  lessons: Lesson[];
}

export interface SubjectSubLessons {
  id: number;
  lesson_id: number;
  indicator_id: number;
  file_is_updated?: boolean;
  file_updated_at?: string | null;
  name: string;
  index: number;
  status: LessonStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string;
  user_id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  indicator_name: string;
}
export interface SubLessonData {
  id: number;
  subject_id: number;
  subject_name: string;
  file_is_updated?: boolean;
  file_updated_at?: string | null;
  year_id: number;
  year_name: string;
  level_count: number;
  lesson_id: number;
  index: number;
  indicator_id: number;
  indicator_name: string;
  name: string;
  status: LessonStatus; // Assuming the status can be either 'enabled' or 'disabled'
  created_at: string; // ISO 8601 date format
  created_by: string;
  updated_at: string; // ISO 8601 date format
  updated_by: string;
  admin_login_as: string | null; // Can be null or a string
}

export interface ResponseSubjectSubLessons {
  data: SubjectSubLessons[];
  message: string;
  status_code: number;
  _pagination: {
    limit: number;
    page: number;
    total_count: number;
  };
}
export interface Indicator {
  id?: string | number;
  criteria_id?: number;
  year_id?: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  learning_content_short_name?: string;
  name: string;
  short_name: string;
  transcript_name: string;
  status?: LessonStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export const MonsterData: Monster[] = [
  { id: 1, MonsterName: 'มอนเตอร์จ้า', image: testlogoMonster, tier: 'normal' },
  { id: 2, MonsterName: 'ราชินีดอกไม้', image: testlogoMonster, tier: 'pre-test' },
  { id: 3, MonsterName: 'ราชินีมด', image: testlogoMonster, tier: 'post-test' },
  { id: 4, MonsterName: 'ราชินีผึ้ง', image: testlogoMonster, tier: 'normal' },
  {
    id: 5,
    MonsterName: 'ราชินีเห็ด',
    image: testlogoMonster,
    tier: 'botestlogoMonsterss',
  },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
  { id: 6, MonsterName: 'ราชินีกระรอก', image: testlogoMonster, tier: 'boss' },
];

export const MapData: Map[] = [
  { id: 1, MapName: 'ทุ่งหญ้าทางตอนเหนือ 1', image: testMap },
  { id: 2, MapName: 'ทุ่งหญ้าทางตอนเหนือ 2', image: testMap },
  { id: 3, MapName: 'ทุ่งหญ้าทางตอนเหนือ 3', image: testMap },
  { id: 4, MapName: 'ทุ่งหญ้าทางตอนเหนือ 4', image: testMap },
  { id: 5, MapName: 'ทุ่งหญ้าทางตอนเหนือ 5', image: testMap },
  { id: 6, MapName: 'ทุ่งหญ้าทางตอนเหนือ 6', image: testMap },
  { id: 7, MapName: 'ทุ่งหญ้าทางตอนเหนือ 7', image: testMap },
  { id: 8, MapName: 'ทุ่งหญ้าทางตอนเหนือ 8', image: testMap },
  { id: 9, MapName: 'ทุ่งหญ้าทางตอนเหนือ 9', image: testMap },
];
