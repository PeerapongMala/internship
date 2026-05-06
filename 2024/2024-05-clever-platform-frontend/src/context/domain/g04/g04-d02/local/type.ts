export interface Homework {
  homework_id: number;
  homework_index: number;
  subject_id: number;
  homework_template_id: number;
  home_work_name: string;
  due_at: string;
  closed_at: string;
  total_level: number;
  pass_level: number;
  level_ids: number[];
  next_level_id: number;
}
