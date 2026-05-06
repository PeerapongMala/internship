export interface StudentGroupInfo {
  id: number;
  subject_id: number;
  class_id: number;
  name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string;
  student_count: number;
  subject_name: string;
  class_academic_year: number;
  class_year: string;
  class_name: string;
  seed_year_short_name: string;
  year: string;
  student_group_id?: number;
  study_group_name: string;
  status: 'enabled' | 'disabled';
}
