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
