import { BaseAPIResponse } from '@global/utils/apiResponseHelper';

export enum Status {
  IN_USE = 'ใช้งาน',
  DRAFT = 'แบบร่าง',
  NOT_IN_USE = 'ไม่ใช้งาน',
}
export enum StatusHomework {
  DEU = 'การบ้านที่ต้องส่ง',
  UPCOMMING = 'การบ้านที่สั่งล่วงหน้า',
  PAST = 'การบ้านที่ผ่านมา',
}
export enum StatusStudent {
  IN_PROCESS = 'กำลังทำ',
  ON_TIME = 'ตรงเวลา',
  LATE = 'เลยกำหนด',
  NOT_SEND = 'ยังไม่ได้ส่ง',
}
export enum Year {
  POR_4 = 'ป.4',
  POR_5 = 'ป.5',
  POR_6 = 'ป.6',
}

export enum Tier {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum StatusHomeworkSent {
  DONE = 'done',
  IN_PROCESS = 'inprocess',
}
export enum StatusTemplate {
  ON = 'on',
  OFF = 'off',
}

export interface Affiliation {
  id: number;
  subject_id: number;
  affiliation_name: string;
  subject_name: string;
  type: string;
}

// export interface Template {
//   templateId: string;
//   status: StatusTemplate;
//   Subject?: Subject[];
//   createdAt: string;
//   createdBy: string;
//   updatedAt: string;
//   updatedBy: string;
// }
// export interface Homework {
//   homeworkId: string;
//   Year: Year;
//   Template: Template[];
//   status: StatusHomework;
//   sent?: number;
//   inProgress?: number;
//   notStart?: number;
//   late?: number;
//   submitDate: string;
//   assignDate: string;
//   createdAt: string;
//   createdBy: string;
//   updatedAt: string;
//   updatedBy: string;
// }

export interface Homework {
  id: number;
  subject_name: string;
  lesson_name?: string;
  asign_by?: string;
  assignDate?: string; //วันที่สั่งการบ้าน
  submitDate?: string; //วันที่ส่งการบ้าน
  total_level?: number; //จำนวนด่าน
  sent?: number; //ส่งแล้เว
  inProgress?: number; //กำลังทำ
  notStart?: number; // ยังไม่ได้เริ่มทำ
  late?: number; //ส่งเลท
  status_homework?: StatusHomework; //สถานะกรบ้าน
  status: Status;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}
export interface Question {
  learningarea_name?: string;
  standard_name?: string;
  indicator_name?: string;
  answer?: string[];
}
export interface DataHomework {
  sub_lesson_id: number;
  sub_lesson_name: string;
  level_id: number;
  level_index: number;
  level_type: string;
  question_type: string;
  level_difficulty: Tier;
  avg_star_count: number;
  avg_max_star_count: number;
  student_done_homework_count: number;
  total_student_count: number;
  done_homework_count: number;
  avg_time_used: number;
  avg_count_do_homework: number;
  latest_do_homework_date: string;
}

export interface StudentSent {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  score: number;
  status?: Status;
  status_homework?: StatusStudent;
  date_assign?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface HomeworkSentOld {
  id: number;
  do_it_time: number; //ทำครั้งที่
  score: number; //คะแนน
  time: string; //เวลาต่อข้อ
  date_homework?: string; //เวลาทำข้อสอบ
  status_homeworksent: StatusHomeworkSent; //สถานะการทำข้อสอบ
}

export interface HomeworkSent {
  homework_submission_index: number;
  total_star_count: number;
  max_star_count: number;
  avg_time_used: number;
  status: string; // "done" หรือ "doing"
  detail_level: DetailLevel[];
}

export interface DetailLevel {
  level_id: number;
  level_index: number;
  level_play_log_id: number;
  total_question: number;
  total_star: number;
  correct_answer_count?: number;
}

// export interface HomeworkTemplate {
//   id: number;
//   seed_year_name: string;
//   subject_name: string;
//   lesson_name: string;
//   total_checkpoint: number;
//   status: Status;
//   created_at?: string;
//   created_by?: string;
//   updated_at?: string;
//   updated_by?: string;
// }
export interface HomeworkTemplate {
  id: number;
  year_name: string;
  year_short_name: string;
  homework_template_name: string;
  subject_name: string;
  lesson_id: number;
  lesson_name: string;
  level_count: number;
  status: Status;
}

export interface Subject {
  subject_id: number;
  subject_name: string;
  curriculum_group_name: string;
  year_name: string;
  year_id: number;
}

export interface SubjectPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: Subject[];
}

export interface StudyGroup {
  study_group_id: number;
  study_group_name: string;
  selected?: boolean;
}

export interface ClassData {
  class_id: number;
  class_name: string;
  study_group: StudyGroup[];
  selected?: boolean;
}

export interface YearData {
  seed_year_id: number;
  seed_year_short_name: string;
  class: ClassData[];
  selected?: boolean;
}

export interface AssignTargetListResponse {
  status_code: number;
  data: YearData[];
  message: string;
}

// เพิ่ม interface สำหรับ homework template
export interface HomeworkTemplateItem {
  id: number;
  year_name: string;
  year_short_name: string;
  homework_template_name: string;
  subject_name: string;
  lesson_id: number;
  lesson_name: string;
  level_count: number;
  status: string;
}

export interface HomeworkTemplateListResponse {
  status_code: number;
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: HomeworkTemplateItem[];
  message: string;
}

// เพิ่ม interface สำหรับข้อมูลที่จะส่งไปสร้างการบ้าน
export interface AssignedTo {
  class_ids: number[];
  study_group_ids: number[];
  seed_year_ids: number[];
}

export interface CreateHomeworkRequest {
  name: string;
  subject_id: number;
  year_id: number;
  homework_template_id: number;
  started_at: string;
  due_at: string;
  closed_at: string;
  status: string;
  assigned_to: AssignedTo;
}

export interface CreateHomeworkResponse {
  status_code: number;
  data: {
    id: number;
  };
  message: string;
}

// เพิ่ม interface ใหม่สำหรับข้อมูลการบ้านจาก API
export interface HomeworkListItem {
  homework_id: number;
  homework_name: string;
  subject_id: number;
  subject_name: string;
  lesson_id: number;
  lesson_name: string;
  started_at: string;
  due_at: string;
  closed_at: string;
  level_count: number;
  assign_target_list: string[];
  total_student_count: number;
  on_time_student_count: number;
  status?: 'enabled' | 'disabled';
  late_student_count: number;
  doing_student_count: number;
  not_start_student_count: number;
}

export interface HomeworkListResponse extends BaseAPIResponse {
  data: HomeworkListItem[];
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
}

export interface DataHomeworkResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: DataHomework[];
  status_code: number;
  message: string;
}

export interface HomeworkTemplateResponse {
  data: HomeworkTemplate[];
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  status_code: number;
  message: string;
}

export interface LessonListItem {
  id: number;
  lesson_name: string;
}

export interface LessonListResponse {
  status_code: number;
  data: LessonListItem[];
  message: string;
}

export enum HomeworkStatus {
  NOT_START = 'Not Start',
  ON_TIME = 'On Time',
  LATE = 'Late',
  NOT_FINISH = 'Not Finish',
}

export interface HomeworkSubmitDetail {
  user_id: string;
  student_no: string;
  title: string;
  first_name: string;
  last_name: string;
  star_count: number;
  max_star_count: number;
  submitted_at: string;
  status: string;
}

export interface HomeworkSubmitDetailListResponse extends BaseAPIResponse {
  data: HomeworkSubmitDetail[];
}

export interface YearOption {
  id: number;
  year_name: string;
}

export interface ClassOption {
  id: number;
  class_name: string;
}
