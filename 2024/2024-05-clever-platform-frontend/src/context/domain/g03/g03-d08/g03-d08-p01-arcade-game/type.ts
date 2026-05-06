export interface MinigameList {
  id: number;
  image_url: string;
  name: string;
  arcade_coin_cost: number;
}

export interface APIResponse {
  status_code: number;
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: MinigameList[];
  message: string;
}

export enum StateFlow {
  Default = 0,
  Anonymous = 1,
}
