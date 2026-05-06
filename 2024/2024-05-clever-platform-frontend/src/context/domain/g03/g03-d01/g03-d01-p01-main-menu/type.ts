export interface IProfile {
  id: string;
  fullname: string;
  avatar?: string;
  school: {
    fullname: string;
    avatar?: string;
  };
  currency: {
    coin: number;
    key: number;
  };
}

export interface Character {
  inventory_id: number;
  avatar_id: number;
  is_equipped: boolean;
  model_id: string;
  level: number;
}

export interface CharacterResponse {
  inventory_id: number;
  avatar_id: number;
  is_equipped: boolean;
  model_id: string;
  level: number;
  buy: boolean;
}

export interface CharacterOutput {
  id: number;
  name: string;
  avatar_id: number;
  description: string;
  model_src: string;
  src: string;
  selected: boolean;
  buy: boolean;
}

export interface CharacterData {
  name: string;
  description: string;
  src: string;
}

export type MainMenuStatistic = {
  selectedSubject: string;
  consecutiveDays?: number;
  trophy?: number;
  placedLeaderboard?: number;
};

export type MainMenuNotification = {
  mail?: number;
  coupon?: number;
};

export type MainMenuFooter = {
  announcement: string;
};

export type MainMenuState = {
  menu: MainMenuStatistic;
  notification: MainMenuNotification;
  footer: MainMenuFooter;
};

export enum StateFlow {
  Default,
}
