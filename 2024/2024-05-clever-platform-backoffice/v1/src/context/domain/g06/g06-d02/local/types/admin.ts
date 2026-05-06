import { Dayjs } from 'dayjs';

export type TTeacherUser = {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number?: string;
  image_url?: string;
  status?: string;
  created_at?: Dayjs | null;
  created_by?: string;
  updated_at?: Dayjs | null;
  updated_by?: string | null;
  last_login?: Dayjs | null;
  have_password?: boolean;
  line_user_id?: string | null;
  teacher_roles: number;
};
