interface BaseUserData {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  last_login: string | null;
}

interface ObserverAccess {
  observer_access_id: number;
  name: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface ObserverData extends BaseUserData {
  observer_accesses: ObserverAccess[];
}

export interface ParentData extends BaseUserData {
  line_subject_id: string | null;
}

export interface NormalUserData extends BaseUserData {
  roles: number[];
}

export type UserDataResponse = {
  status_code: number;
  data: [ObserverData | ParentData | NormalUserData];
  message: string;
};
