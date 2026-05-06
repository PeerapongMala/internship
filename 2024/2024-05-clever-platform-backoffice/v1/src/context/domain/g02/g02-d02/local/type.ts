export enum ManageYearStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export interface IManageYear {
  id: number;
  curriculum_group_id: number;
  platform_id: number;
  seed_year_id: number;
  status: 'enabled' | 'draft' | 'disabled';
  created_at: null | string;
  created_by: null | string;
  updated_at: null | string;
  updated_by: null | string;
  admin_login_as: null | string;
  seed_year_name?: string;
  seed_year_short_name?: string;
  subjects?: any[];
}

export interface IAddManageYear {
  curriculum_group_id: number;
  seed_year_id: number;
  status: string;
}

export interface IUpdateManageYear {
  id: number;
  admin_login_as: string;
  status: string;
}

export interface ISeedYear {
  id: number;
  name: string;
  short_name: string;
}

export interface ICreateSubjectGroup {
  year_id: number;
  seed_subject_group_id: number;
  status: string;
  admin_login_as?: string;
}

export interface IUpdateSubjectGroup {
  status: string;
  seed_subject_group_id: number;
  id: number;
}

export interface ICreateSubject {
  subject_group_id: number;
  name: string;
  project: string;
  subject_language_type: string;
  subject_language: string;
  subject_image: File | null;
  status: string;
  admin_login_as?: string;
}

export interface IUpdateSubject extends ICreateSubject {
  id: number;
  subject_translation_languages: string[] | null;
}

export interface ISubjectGroup {
  id: number;
  year_id: number;
  seed_subject_group_id: number;
  status: string;
  created_at: null | string;
  created_by: null | string;
  updated_at: null | string;
  updated_by: null | string;
  admin_login_as: null | string;
  seed_subject_group_name: string;
  subjects: ISubjectGroupSubject[];
}

export interface ISubjectGroupSubject {
  id: number;
  subject_group_id: number;
  name: string;
  project: string;
  subject_language_type: string;
  subject_language: string;
  subject_translation_languages: null | string;
  image_url: null | string;
  status: string;
  created_at: null | string;
  created_by: null | string;
  updated_at: null | string;
  updated_by: null | string;
  admin_login_as: null | string;
}

export interface ISubject {
  id: number;
  subject_group_id: number;
  name: string;
  project: string;
  subject_language_type: string;
  subject_language: string;
  subject_translation_languages: null | string[];
  image_url: null | string;
  status: string;
  created_at: null | string;
  created_by: null | string;
  updated_at: null | string;
  updated_by: null | string;
  admin_login_as: null | string;
  seed_subject_group_id: number;
  seed_subject_group_name: string;
  seed_year_short_name: string;
  seed_year_id: number;
}

export interface ISeedSubjectGroup {
  id: number;
  name: string;
}

export interface ITagGroup {
  id: number;
  index: number;
  name: string;
  new_name?: string;
  tags: ITag[];
}

export interface ITag {
  id?: number;
  name: string;
  status: string;
  created_at?: null | string;
  created_by?: null | string;
  updated_at?: null | string;
  updated_by?: null | string;
  admin_login_as?: null | string;
}

export interface ITagCreate {
  tag_group_id: number;
  name: string;
  admin_login_as?: string;
}

export interface ITagPatch {
  id: number;
  name: string;
  status: string;
  admin_login_as?: string;
}

export interface ITagGroupPatch {
  id: number;
  name: string;
}

export interface IDownloadCsvFilter {
  // format start_date=2023-11-25&end_date=2025-11-25
  start_date: string;
  end_date: string;
  curriculum_group_id?: number;
}

export interface IPlatformBase {
  curriculum_group_id: number;
  seed_platform_id: number;
  status: 'draft' | 'enabled' | 'disabled';
  admin_login_as: null | string;
}

export interface IPlatform extends IPlatformBase {
  id: number;
  seed_platform_name: string;
  created_at: string;
  created_by: string;
  updated_at: null | string;
  updated_by: null | String;
}

export interface ISeedPlatform {
  id: number;
  name: string;
}
