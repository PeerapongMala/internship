export interface RewardList {
  subject_id: number;
  day: number;
  item_id: number;
  gold_coin_amount: number | null;
  arcade_coin_amount: number | null;
  ice_amount: number | null;
  item_amount: number;
  tier: number;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
  status: 'checkin' | 'ice' | 'non-checkin';
}

export interface UserStat {
  student_id: string;
  subject_id: number;
  last_checkin: string;
  current_streak: number;
  highest_streak: number;
}

export interface ApiResponse<T> {
  data: T;
  status_code: number;
  message: string;
}

export interface CheckinRequest {
  bulk_edit_list: CheckinBody[];
}

export interface CheckinBody {
  subject_id: number;
  check_in_date: string;
  reset_flag: boolean;
  is_check_in: boolean;
}

export interface CheckinResponse {
  statusCode: number;
  message: string;
}

export interface GoldCoinResponse {
  data: UserDetail[];
  statusCode: number;
  message: string;
}

export interface UserDetail {
  id: number;
  student_id: string;
  gold_coin: number;
  arcade_coin: number;
  ice: number;
}

export interface UseItem {
  subject_id: number;
  use_coin_flag: boolean;
  gold_coin_amount?: number;
  use_item_flag: boolean;
}
