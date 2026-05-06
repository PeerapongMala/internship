export interface BarChartData {
  id: string;
  progress: number;
  inspection_area: string;
  created_at: string;
}

export type BarChartDataArray = BarChartData[];

export interface FilterArea {
  inspection_area: Area[];
}

interface Area {
  id: string;
  name: string;
}

export interface FilterAreaOffice {
  area_office: string[];
}

export interface FilterSchool {
  school: string[];
}

export interface SchoolData {
  id: string;
  class: string;
  inspection_area: string;
  school: string;
  area_office: string;
  progress: number;
  progressClass: ProgressClass[];
}

export type SchoolDataArray = SchoolData[];

export interface TeacherData {
  teacher_id: string;
  id: string;
  name: string;
  inspection_area: string;
  school: string;
  area_office: string;
  classRoomInCare: number;
  progress: number;
  homeworkSubmit: number;
  progressClass: ProgressClass[];
}

export type TeacherDataArray = TeacherData[];

interface ProgressClass {
  class: string;
  data: number;
}

export interface ProgressData {
  id: string;
  progressClass: ProgressClass[];
  inspection_area: string;
  school: string;
  area_office: string;
}

export type ProgressDataArray = ProgressData[];

export interface ProgressTableResponse {
  average_progress: number;
  start_date: string;
  end_date: string;
  progress_reports: ProgressReport[];
}

export interface ProgressReport {
  scope: string;
  progress: number;
}

export interface ProgressTableQuery {
  scope?: string;
  parent_scope?: string;
  report_type?: string;
  start_date?: string;
  end_date?: string;
}
