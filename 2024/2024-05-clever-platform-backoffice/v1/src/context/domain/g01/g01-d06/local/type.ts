import { date, object, ObjectSchema, string } from 'yup';

export enum AffiliationStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export enum AffiliationGroupType {
  OBEC = 'สพฐ.',
  DOE = 'สนศ. กทม.',
  OPEC = 'สช.',
  LAO = 'อปท.',
  OTHER = 'อื่นๆ',
}

export interface AffiliationBase {
  id?: string | number;
  school_affiliation_group: AffiliationGroupType;
  name?: string;
  short_name?: string;
  type: string;
  status: AffiliationStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface AffiliationOBEC
  extends Omit<AffiliationBase, 'school_affiliation_group'> {
  school_affiliation_group: AffiliationGroupType.OBEC;
  area_office: string;
  inspection_area: string;
}

export interface AffiliationDOE
  extends Omit<AffiliationBase, 'school_affiliation_group'> {
  school_affiliation_group: AffiliationGroupType.DOE;
  district: string;
  district_zone: string;
}

export interface AffiliationOPEC
  extends Omit<AffiliationBase, 'school_affiliation_group'> {
  school_affiliation_group: AffiliationGroupType.OPEC;
}

export interface AffiliationLAO
  extends Omit<AffiliationBase, 'school_affiliation_group'> {
  school_affiliation_group: AffiliationGroupType.LAO;
  lao_type: string;
  province: string;
  district?: string;
  sub_district?: string;
}

export interface AffiliationOther
  extends Omit<AffiliationBase, 'school_affiliation_group'> {
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
  name: string;
  amount_of_schools: number;
  start_date: string;
  end_date: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  status?: AffiliationStatus;
}

export interface School {
  id: string;
  short_id: string;
  name: string;
  affiliation_name: string;
  inspection_area: string;
  office_area: string;
  province: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  school_affiliation_id: number;
  school_affiliation_type: string;
  school_affiliation_name: string;
  school_affiliation_short_name: string;
  code: string;
}

// export interface Subject {
//   id: string;
//   affiliation_name: string;
//   platform_name: string;
//   subject_group: string;
//   year: string;
//   subjects: string[];
//   created_at?: string;
//   created_by?: string;
//   updated_at?: string;
//   updated_by?: string;
// }

export interface CreateSubjectTeacher {
  subject_id: number;
  teacher_ids: string[];
  academic_year: number;
}

export type SubjectStatus = 'enabled' | 'disabled' | 'draft';
export interface Subject {
  id: number;
  name: string;
  year: string;
  contract_name: string;
  contract_status: SubjectStatus;
  curriculum_group: string;
  updated_at: string | null;
  updated_by: string | null;
  is_expired: boolean;
}

export interface SubjectTeacher {
  id: string;
  academic_year: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string | null;
  userId: string;
}

export type AcademicYear = {
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
};

export interface SchoolTeacher {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string | null;
}

// export const AffiliationSchema: ObjectSchema<IAffiliation> = object({
//   id: string(),
//   type: string<`${AffiliationType}`>().required(),
//   affiliationId: string().optional(),
//   affiliationName: string().optional(),
//   affiliationShortName: string().optional(),
//   affiliationInspectionArea: string().optional(),
//   affiliationArea: string().optional(),
//   affiliationType: string().optional(),
//   lastUpdatedDate: date().optional(),
//   lastUpdatedBy: string().optional(),
//   status: string<`${AffiliationStatus}`>(),
// });
