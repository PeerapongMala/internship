interface Record {
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  admin_login_as: string | null;
  created_by_name: string;
  updated_by_name: string | null;
}

type Status = 'draft' | 'enabled' | 'disabled';

export interface Item {
  id: number;
  teacher_item_group_id: number;
  template_path?: string | null;
  type: string;
  name: string;
  description: string;
  image_url: string;
  status: Status;
  badge_description?: string;
}

export type StoreStatus = 'pending' | 'enabled' | 'expired';

export interface StoreItem extends Record {
  id: number;
  item_id: Item['id'];
  item_name: string;
  item_type: ItemType;
  // store_id: number;
  stock: number;
  initial_stock: number | null;
  price: number;
  open_date: string | null;
  closed_date: string | null;
  status: StoreStatus;
}

export type StoreTransactionStatus = 'enabled' | 'recalled';

export interface StoreTransaction extends Record {
  id: number;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  bought_at: string;
  status: StoreTransactionStatus;
  teacher_store_item_id: number;
  recalled_at: string | null;
}
