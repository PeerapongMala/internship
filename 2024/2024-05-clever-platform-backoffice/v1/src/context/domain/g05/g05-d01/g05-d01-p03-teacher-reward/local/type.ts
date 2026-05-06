export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface Curriculum {
  id: number;
  name?: string;
  short_name?: string;
  status?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface StageValues {
  gold: string;
  arcade: string;
}

export interface StageCardProps {
  title: string;
  onChange: (stage: string, values: StageValues) => void;
  goldPlaceholder?: string;
}

export enum Status {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export interface SpecialReward {
  id: number;
  subject_name?: string;
  lesson_name?: string;
  sublesson_name?: string;
  totalreward: number;
  updated_at: string;
  updated_by: string;
  status: Status;
}

export interface SpecialRewardInside {
  id: number;
  image?: string;
  item_name?: string;
  discription?: string;
  total: number;
  updated_at: string;
  updated_by: string;
  status: Status;
}

export enum StatusReward {
  IN_USE = 'used',
  SEND = 'send',
  RECEIVED = 'received',
  RECALL = 'callback',
}

export interface RewardTeacher {
  id: number;
  name_reward: string;
  total: number;
  type: string;
  school_id: string;
  title_name: string;
  first_name: string;
  last_name: string;
  school_year: string;
  seed_year_name: string;
  room: number;
  status: StatusReward;
  updated_at: string;
  updated_by: string;
  used_at: string;
}

export interface TeacherReward {
  id: number;
  subject_teacher_id: number;
  subject_id: number;
  subject_name: string;
  student_id: string;
  student_title: string;
  student_first_name: string;
  student_last_name: string;
  user_id: string;
  academic_year: string;
  year: string;
  class_name: string;
  item_id: number;
  item_name: string;
  amount: number;
  status: StatusReward;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
export interface FilterSubject {
  subject_id: number;
  subject_name: string;
}

export interface Student {
  user_id: string;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
}
export interface ModalClassroom {
  class_id: number;
  class_name: string;
  class_year: string;
  class_academic_year: number;
  student_count: number;
}
export interface ModalStudyGroup {
  study_group_id: number;
  study_group_name: string;
  class_year: string;
  class_name: string;
  student_count: number;
}
export interface GetByStudent {
  user_id: string;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  academic_year: number;
  year: string;
  class: string;
}

export interface CreateReward {
  student: { id: string }[];
  subject_id: number;
  item_id: number;
  amount: number;
  status: StatusReward;
}

export interface academicYear {
  academic_year: number;
}
export interface Year {
  year: string;
}
export interface Classroom {
  class_name: number;
}

export interface TeacherItem {
  ItemId: number;
  ItemName: string;
}

export interface ItemList {
  id: number;
  type: string;
  name: string;
  description: string;
  image_url: string;
}

export interface IDownloadCsv {
  start_date: string;
  end_date: string;
  subject_id?: number;
  status?: Status;
}

export interface NewCreateReward {
  subject_id?: string;
  reward_name?: string;
  reward_amount?: string;
  student_ids?: string[];
  study_group_ids?: string;
  class_ids?: string;
  status?: string;
  image?: File;
  images_key?: string;
}
