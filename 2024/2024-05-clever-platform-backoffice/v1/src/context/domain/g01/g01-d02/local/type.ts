export enum UseStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export enum AffiliationGroupType {
  OBEC = 'สพฐ',
  DOE = 'สนศ. กทม.',
  OPEC = 'สช',
  LAO = 'อปท',
  OTHER = 'อื่นๆ',
}

export interface AffiliationBase {
  id?: string | number;
  name?: string;
  short_name?: string;
  type: string;
  status: UseStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface AffiliationOBEC extends AffiliationBase {
  school_affiliation_group: AffiliationGroupType.OBEC;
  area_office: string;
  inspection_area: string;
}

export interface AffiliationDOE extends AffiliationBase {
  school_affiliation_group: AffiliationGroupType.DOE;
  district: string;
  district_zone: string;
}

export interface AffiliationOPEC extends AffiliationBase {
  school_affiliation_group: AffiliationGroupType.OPEC;
}

export interface AffiliationLAO extends AffiliationBase {
  school_affiliation_group: AffiliationGroupType.LAO;
  lao_type: string;
  province: string;
  district?: string;
  sub_district?: string;
}

export interface AffiliationOther extends AffiliationBase {
  school_affiliation_group: AffiliationGroupType.OTHER;
}

export type Affiliation =
  | AffiliationOBEC
  | AffiliationDOE
  | AffiliationOPEC
  | AffiliationLAO
  | AffiliationOther;

export interface AffiliationContract {
  id?: string | number;
  seed_platform_id: number;
  seed_platform_name: string;
  school_affiliation_id: string;
  name: string;
  school_count: number;
  start_date: string;
  end_date: string;
  wizard_index: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  status?: UseStatus;
}

export interface CreatedAffiliationContract {
  school_affiliation_id: string;
  name: string;
  start_date: string;
  end_date: string;
  wizard_index: number;
}

export interface UpdatedAffiliationContract {
  name?: string;
  start_date?: string;
  end_date?: string;
  wizard_index?: number;
  status?: UseStatus;
}

export interface School {
  id: string;
  school_code: string;
  school_name: string;
  school_affiliation_type: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface Subject {
  id: string;
  curriculum_group: string;
  platform_name: string;
  subject_group: string;
  year: string;
  subjects: string[];
  status?: UseStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  is_enabled: boolean;
}

type RecordStatus = 'draft' | 'enabled' | 'disabled';
interface RecordStamp {
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface CurriculumGroup extends RecordStamp {
  id: number;
  name: string;
  short_name: string;
  status: RecordStatus;
}

export interface ContentCreator {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  last_login: string;
}

export interface SeedYear {
  id: number;
  name: string;
  short_name: string;
  status: RecordStatus;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface SeedPlatform {
  id: string;
  name: string;
}
