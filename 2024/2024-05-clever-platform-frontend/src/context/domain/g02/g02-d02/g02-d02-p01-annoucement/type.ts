export type AnnounceMenuState = {
  selectedAnnounce: number;
  selectedTab: number;
};

export interface AnnounceContent {
  description: string;
  image_url: string | null;
}

export interface AnnounceData {
  announcement_id: number;
  started_at: string;
  ended_at: string;
  title: string;
  description: string;
  image_url: string | null;
  is_read: boolean;
}
