export interface LevelList {
  id: number;
  level: number;
  difficulty: string;
  question_count: number;
  star: number | null;
  time_used: string | null;
  status: 'lock' | 'unlock';
  game_reward: any | null;
  arcade_coin?: string;
  gold_coin?: string;
}

export interface LevelListResponse {
  data: LevelList[];
}
