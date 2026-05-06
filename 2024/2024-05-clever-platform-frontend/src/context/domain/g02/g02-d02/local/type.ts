export interface SubjectListItem {
  no: number | null;
  seed_subject_group_id: number;
  subject_id: string;
  year_name: string;
  year_short_name: string;
  subject_name: string;
  curriculum_group_name: string;
  is_enabled: boolean;
  image_url?: string | null;
  is_contract_enabled: boolean;
  is_contract_subject_group_enabled: boolean;
  is_curriculum_group_enabled: boolean;
  is_in_contract_time: boolean;
  is_platform_enabled: boolean;
  is_school_subject_enabled: boolean;
  is_subject_enabled: boolean;
  is_subject_group_enabled: boolean;
  is_year_enabled: boolean;
}
