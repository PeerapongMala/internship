export interface DataAPIResponseNoCode<T> {
  data: T;
}

export interface InventoryInfo {
  id: number;
  student_id: string;
  gold_coin: number;
  arcade_coin: number;
  ice: number;
  stars: number;
}

export interface StreakLogin {
  name: string;
  count: number;
}

export interface Achievement {
  level_special_reward_id: number;
  amount: number;
  type: string;
  name: string;
  description: string;
  image_url: string;
  received_at: string;
}
