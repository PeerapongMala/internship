export interface Achievement {
  level_special_reward_id: number;
  amount: number;
  type: string | null;
  name: string | null;
  description: string | null;
  image_url: string | null;
  template_url: string | null;
  badge_description: string | null;
  lesson_name: string | null;
  sub_lesson_name: string | null;
  level_index: number;
  level_id: number;
  received_at: string | null;
  received_status: boolean;
}
export interface SubjectListItem {
  no: number;
  subject_id: string;
  year_name: string;
  year_short_name: string;
  subject_name: string;
  curriculum_group_name: string;
  lesson_name: string;
  is_enabled: boolean;
  image_url?: string;
}
