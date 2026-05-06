import { Dayjs } from 'dayjs';

export type TSubject = {
  subject_id: number;
  platform_name: string;
  subject_name: string;
  subject_group_id: number;
  subject_group_name: string;
  year_id: number;
  seed_year_name: string;
  curriculum_group_id: number;
  curriculum_group_name: string;
  status: string;
  created_at: Dayjs | null;
  created_by: string;
  updated_at: Dayjs | null;
  updated_by: string;
};
