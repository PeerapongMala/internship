import { ERoomType } from '../api/helper/chat';

export type TRoom = {
  id: string;
  content: string | null;
  school_id: number;
  sender_id: string | null;
  sender_name: string | null;
  room_id: string;
  room_type: ERoomType;
  created_at: Date | null;
  room_name: string | null;
  image_url: string | null;
  member_count: number;
  private_class: string | null;
  subject_name: string[] | null;
  academic_year: number;
};
