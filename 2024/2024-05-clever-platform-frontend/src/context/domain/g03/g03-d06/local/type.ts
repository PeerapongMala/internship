export type AnnounceMenuState = {
  selectedAnnounce: number;
  selectedTab: number;
};

export interface ActivityContent {
  description: string;
  image_url?: string | null;
  arcade_game_id: number;
  arcade_game_name: string;
}

export interface MailboxContent {
  description: string;
  image_url?: string | null;
  item_list?: any | null;
  coin_list?: any | null;
  is_read?: boolean;
  is_received?: boolean;
}

export interface GiftContent {
  amount: number;
  description: string;
  image_url?: string;
  item_id: number;
  name: string;
  reward_id: number;
  sended_at: string;
  sended_from: string;
  status: 'send' | 'received' | (string & {});
  type: string;
}

export interface NotificationContent {
  description: string;
  image_url?: string | null;
}

export interface AnnouncementData {
  id: number;
  title: string;
  description: string;
  started_at: string;
  ended_at: string;
  image_url: string | null;
  is_read?: boolean;
}
