import { ModalClassroom } from '../../type';

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
  type: string;
  name: string;
  description: string;
  image_url: string;
  status: Status;
  template_path?: string | null;
  badge_description?: string;
}

export type StoreStatus = 'pending' | 'enabled' | 'expired';

export interface StoreItem extends Record {
  id: number;
  item_id: Item['id'];
  item_name: string;
  item_type: ItemType;
  stock: number;
  initial_stock: number | null;
  price: number;
  open_date: string | null;
  closed_date: string | null;
  status: StoreStatus;
}
export interface NewStoreItem extends Record {
  id: number;
  item_id?: Item['id'];
  item_name: string;
  item_description?: string;
  item_type: ItemType;
  stock: number;
  initial_stock: number | null;
  limit_per_user?: number | null;
  price: number;
  open_date: string | null;
  closed_date: string | null;
  status: StoreStatus;

  limit?: number;
  image_url?: File;
  image_key?: string;
  class_ids?: Array<{
    class_id: number;
    class_name: string;
    class_year: string;
    class_academic_year: number;
    student_count: number;
  }>;
  study_group_ids?: Array<{
    study_group_id: number;
    study_group_name: string;
    class_year: string;
    class_name: string;
    student_count: number;
  }>;
  student_ids?: Array<{
    user_id?: string;
    student_id?: string;
    first_name?: string;
    last_name?: string;
  }>;
}

export interface ShopStockGetBy {
  id: number;
  item_id: number;
  teacher_store_id: number | null;
  stock: number;
  initial_stock: number;
  price: number;
  open_date: string;
  closed_date: string;
  status: StoreStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string | null;
  item_name: string;
  item_description: string;
  item_type: string;
  created_by_name: string;
  updated_by_name: string;
  transaction_count: number;
  images: string;
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

export type SubjectShop = {
  subject_id: number;
  year: string;
  short_year: string;
  subject_name: string;
  update_at: string | null;
  update_by: string | null;
};

export interface SchoolHeader {
  school_id: number;
  school_name: string;
  school_code: string;
  shool_image_url: string | null;
}

export interface CopyShop {
  subject_id: number;
  class_ids?: Array<{
    class_id: number;
    class_name: string;
    class_year: string;
    class_academic_year: number;
    student_count: number;
  }>;
  study_group_ids?: Array<{
    study_group_id: number;
    study_group_name: string;
    class_year: string;
    class_name: string;
    student_count: number;
  }>;
  student_ids?: Array<{
    user_id: string;
    student_id: string;
    first_name: string;
    last_name: string;
  }>;
  item_name: string;
  item_description?: string;
  image_url: string;
  image_key: string;
  initial_stock: number;
  price: number;
  open_date: string;
  closed_date: string;
  status: StoreStatus;
  limit_per_user?: number;
}
