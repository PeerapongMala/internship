export interface IAccount {
  fullname: string;
  uuid: string;
  currency: {
    coin: number;
    key: number;
  };
  avatar?: string;
  role?: string;
  frame?: string;
}

export interface ISubjectAward {
  subject: string;
  consecutiveDays: number;
  trophy: number;
}

export interface IProfile {
  account: IAccount;
  award: ISubjectAward;
}

export interface BadgeData {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface AllEquipped {
  characters: string | null;
  badges: BadgeData | null; // Updated to type object
  pets: string | null;
  frame: string | null;
}

export enum StateFlow {
  Default = 0,
  Anonymous = 1,
}
