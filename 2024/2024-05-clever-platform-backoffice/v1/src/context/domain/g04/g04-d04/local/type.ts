export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export enum Leveltype {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
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

export interface SeedYear {
  id: number;
  name: string;
}
export interface FilterSubject {
  id: number;
  name: string;
}
export interface FilterLesson {
  id: number;
  name: string;
}
export interface FilterSublesson {
  id: number;
  name: string;
}
export interface LevelReward {
  id: number;
  seed_subject_group_id?: number;
  level_type?: Leveltype;
  star_required?: number;
  gold_coin?: number;
  arcade_coin?: number;
  updated_at: string;
  updated_by: string;
  status: Status;
}

export interface StageValues {
  gold: string;
  arcade: string;
}

export interface StageCardProps {
  title: string;
  star_required: number;
  gold_coin: number;
  arcade_coin: number;
}

export enum Status {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
  SETTING = 'setting',
  QUESTION = 'question',
  TRANSLATION = 'translation',
  SPEECH = 'speech',
}

export interface SpecialReward {
  id: number;
  subject_name?: string;
  lesson_name?: string;
  sublesson_name?: string;
  reward_amount: number;
  updated_at: string;
  updated_by: string;
  status: Status;
}

export interface SpecialRewardInside {
  id: number;
  image_url?: string;
  name?: string;
  type?: string;
  description?: string;
  amount: number;
  updated_at: string;
  updated_by: string;
  status: Status;
}

export enum TypeItem {
  FRAME = 'frame',
  BADGE = 'badge',
  REWARD = 'reward',
}

export interface Item {
  id: number;
  image_url: string;
  name: string;
  type: string;
  description: string;
}

export interface GetDataCard {
  index: number;
  curriculum_group?: string;
  platform?: string;
  year?: string;
  subject_group: string;
  subject_name: string;
  lesson: string;
  sub_lesson: string;
}

export interface CreateItem {
  level_ids: number[];
  item_ids: number[];
  amount: number;
}
