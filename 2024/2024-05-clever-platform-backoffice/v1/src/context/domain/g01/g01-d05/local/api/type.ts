import { TBaseErrorResponse } from '@global/types/api';

interface Record {
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

type Status = 'draft' | 'enabled' | 'disabled';

// User
export interface User extends Record {
  id: string;
  email: string;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  last_login: string;
}

// Classroom

export interface ClassroomBase {
  school_id: number;
  academic_year: number;
  year: string;
  name: string;
}

export interface Classroom extends Record, ClassroomBase {
  id: number;
  status: string;
}

export interface StudyGroup extends Record {
  id: number;
  subjet_id: number;
  class_id: number;
  name: string;
  status: string;
}

export interface StudentGroupStudent {
  study_group_id: number;
  student_id: string;
}

// School

export interface ClassroomStudent {
  class_id: number;
  student_id: string;
}

export interface ClassroomTeacher {
  class_id: number;
  teacher_id: string;
}

export interface School extends Record {
  id: number;
  image_url: string;
  name: string;
  address: string;
  region: string;
  province: string;
  district: string;
  sub_district: string;
  post_code: string;
  latitude: string;
  longtitude: string;
  director: string;
  director_phone_number: string;
  registrar: string;
  registrar_phone_number: string;
  academic_affair_head: string;
  academic_affair_head_phone_number: string;
  advisor: string;
  advisor_phone_number: string;
  status: string;
  code: string;

  school_affiliation_id: number;
  school_affiliation_type: string;
  school_affiliation_name: string;
  school_affiliation_short_name: string;
}

export interface SchoolTeacher {
  school_id: number;
  user_id: string;
}

export interface SeedYear {
  id: number;
  name: string;
  short_name: string;
  status: Status;
}

// Teacher

export interface Teacher extends User {}

export interface Student extends User {}

export type TMoveStudentCsvReq = {
  csv_file: File;
  force_move?: boolean;
};
export type TMoveStudentCSVConflictRes = TBaseErrorResponse<
  {
    record_id: number;
    name: string;
    message_list: string[];
  }[]
>;
