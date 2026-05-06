import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface BaseDateCreated {
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface UserAccountResponse extends BaseDateCreated {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  created_at: string;
  last_login: string;
  have_password: boolean;
  line_user_id: string | null;
  roles: number[];
}

export interface ParentsAccountResponse extends BaseDateCreated {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  last_login: string | null;
  relationship: string;
  phone_number: string;
  have_password: boolean;

  birth_date: string;
}

export interface ObserverAccessResponse extends BaseDateCreated {
  id: number;
  name: string;
  access_name: string;
  district_zone: string;
  area_office: string;
  district_group: string;
  district: string;
  school_affiliation_id: number;
  status: string;
}

export interface ObserversAccountResponse extends BaseDateCreated {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  have_password: boolean;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  last_login: string;
  observer_accesses: ObserverAccessResponse[];
}

export interface AdminUserAccountQueryParams extends BasePaginationAPIQueryParams {
  roles?: number[];
  search_field?: string;
  search_value?: string;
}

export interface BulkEditItem {
  user_id: string;
  status: 'enabled' | 'disabled' | 'draft';
}

export interface BulkEditRequest {
  bulk_edit_list: BulkEditItem[];
}

export type UserEditType = {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled';
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  last_login: string | null;
} & (
  | {
      type: 'user';
      roles: number[];
      line_user_id: string | null;
    }
  | {
      type: 'parent';
      relationship: string;
      phone_number: string;
      birth_date: string;
      line_subject_id?: string | null;
    }
  | {
      type: 'observer';
      observer_accesses: ObserverAccessResponse[];
    }
);

export const USER_ROLES = {
  ADMIN: 1,
  CONTENT_CREATOR: 2,
  GAME_MASTER: 3,
  OBSERVER: 4,
  ANNOUNCER: 5,
} as const;

export const USER_ROLE_LABELS: Record<number, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.CONTENT_CREATOR]: 'Content Creator',
  [USER_ROLES.GAME_MASTER]: 'Game Master',
  [USER_ROLES.OBSERVER]: 'Observer',
  [USER_ROLES.ANNOUNCER]: 'Announcer',
};

export interface ObserverQueryParams extends BasePaginationAPIQueryParams {
  observer_access_id?: number;
  search_field?: string;
  search_value?: string;
}
