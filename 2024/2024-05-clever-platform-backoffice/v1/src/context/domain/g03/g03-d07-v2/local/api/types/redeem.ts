export enum StatusRedeem {
  PENDING = 'pending',
  SENT = 'sent',
}

export interface Redeem {
  id: number;
  reward_name: string;
  title: string;
  first_name: string;
  last_name: string;
  year: string;
  class_room: string;
  status: StatusRedeem;
  created_at: string;
}
