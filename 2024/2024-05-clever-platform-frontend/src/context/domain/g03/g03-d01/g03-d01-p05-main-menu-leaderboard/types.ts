export interface MenuLeaderboardData {
  index: number;
  gameid: string;
  id: string;
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

export interface AccountList {
  index: number; // Position in the leaderboard
  avatarImage: string; // URL for the user's avatar image
  username: string; // User's display name
  score: number; // User's score
  time: string; // Time in string format
}

export enum StateTab {
  ClassroomTab = 0,
  YearTab = 1,
  AffiliationTab = 2,
  CountryTab = 3,
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  status_code: number;
  message: string;
}

export interface LeaderboardEntry {
  no: number;
  level_id: number;
  user_id: string;
  user_name: string;
  user_image_url: string;
  star: number;
  time_used: number;
  me_flag: boolean;
}
