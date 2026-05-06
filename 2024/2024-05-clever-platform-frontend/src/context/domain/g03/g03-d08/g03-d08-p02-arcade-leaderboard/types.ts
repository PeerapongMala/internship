export interface LeaderboardResponse {
  event_total: number;
  type?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  leaderboard?: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  no: number;
  student_image: string;
  student_id: string;
  student_name: string;
  total_score: number;
  total_time: number;
  me_flag?: boolean;
}
export interface PaginationInfo {
  page: number;
  limit: number;
  total_count: number;
}
export interface EventInfoPart {
  event_total: number;
  event_ids: number[];
}
export interface TimeInfoPart {
  type: string;
  title: string;
  start_date: string;
  end_date: string;
}
export interface LeaderboardArrayResponse extends Array<LeaderboardDataPart> {
  0: EventInfoPart;
  1: TimeInfoPart;
  2: LeaderboardEntry[];
}
type LeaderboardDataPart = EventInfoPart | TimeInfoPart | LeaderboardEntry[];
export interface LeaderboardResponse {
  eventInfo: {
    event_total: number;
    event_ids: number[];
  };
  timeInfo: {
    type: string;
    title: string;
    start_date: string;
    end_date: string;
  };
  records: LeaderboardEntry[];
}

export interface LeaderboardResponse extends Array<any> {
  0: { event_total: number; event_ids: number[] };
  1: {
    type: string;
    title: string;
    start_date: string;
    end_date: string;
  };
  2: LeaderboardEntry[];
}

export enum DateType {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}

export interface ArcadeLeaderboardData {
  id: string;
  index: number;
  gameid: string;
  time: string;
  score: number;
  avatarImage: string;
  username: string;
  lastLogin?: Date | string;
  status?: 'Waiting' | 'Complete';
  title: string;
  image: string;
  affiliation: AccountList[];
  year: AccountList[];
  classroom: AccountList[];
  country: AccountList[];
  price: number;
  coin: number;
}

export interface MinigameList {
  id?: number;
  image_url?: string;
  name?: string;
  arcade_coin_cost?: number;
  title?: string;
}

export interface GameId {
  id: number;
}

export interface AccountList {
  index: number;
  avatarImage: string;
  username: string;
  score: number;
  time: string;
}

export enum StateTab {
  ClassroomTab = 0,
  YearTab = 1,
  AffiliationTab = 2,
  CountryTab = 3,
}

export interface UserDetail {
  id: string;
  first_name: string;
  image_url: string;
  arcade_coin: string;
}
