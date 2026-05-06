// interface RecordStamp {
//   created_at: string;
//   created_by: string;
//   updated_at: string | null;
//   updated_by: string | null;
//   admin_login_as: string | null;
// }

type ItemType = 'frame' | 'badge' | 'coupon';

interface Item extends RecordStamp {
  id: number;
  template_item_id: number | null;
  type: ItemType;
  name: string;
  description: string;
  image?: File | null;
  image_url: string;
  status: Status;
  template_path?: string;
  badge_description?: string;
  school_id?: string;
}
