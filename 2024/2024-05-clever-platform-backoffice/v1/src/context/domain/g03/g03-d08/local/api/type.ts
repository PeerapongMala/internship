export type Subject = {
  id: number;
  year: string;
  subject: string;
  update_at: string | null;
  update_by: string | null;
};

export interface Item extends RecordStamp {
  id: number;
  teacher_item_group_id: number | null;
  type: ItemType;
  name: string;
  description: string;
  image?: File | null;
  image_url: string | null;
  status: Status;
  template_path?: string | null;
  badge_description?: string | null;
}

export interface SchoolHeader {
  school_id: number;
  school_name: string;
  school_code: string;
  shool_image_url: string | null;
}
