import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface BaseDateCreated {
  created_at?: string | null;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface UserEntity {
  title: string;
  first_name: string;
  last_name: string;
  email?: string;
  image_url?: string;
  status: 'enabled' | 'draft' | 'disabled';
}

export interface CreatedUserEntity extends Omit<UserEntity, 'id' | 'image_url'> {
  profile_image?: string | File;
}

export interface UpdatedUserEntity extends Omit<UserEntity, 'image_url'> {
  profile_image?: string | File;
}

export interface BulkUserUpdateRecord {
  user_id: string;
  status: 'enabled' | 'draft' | 'disabled' | (string & {});
}

export interface UpdatedUserResponse extends UserEntity, BaseDateCreated {
  id: string;
  id_number?: string | null;
  last_login?: string | null;
  roles?: number[] | null;
}

export interface TeacherRecord extends UserEntity, BaseDateCreated {
  id: string;
  teacher_accesses?: number[];
  line_user_id?: string | null;
  id_number?: string | null;
  last_login?: string | null;
  have_password?: boolean;
}

export interface CreatedTeacherRecord extends CreatedUserEntity {
  school_id: string;
  teacher_accesses?: number[];
}

export interface UpdatedTeacherAccessRecord {
  teacher_accesses?: number[];
}

export interface UpdatedTeacherRecord
  extends UpdatedUserEntity,
    UpdatedTeacherAccessRecord {}

export interface TeacherAccess {
  teacher_access_id: number;
  access_name: string;
}

export interface TeacherTeachingLogRecord {
  academic_year: number;
  curriculum_group_name: string;
  subject: string;
  year: string;
}

export interface TeacherClassLogRecord {
  class_id: number;
  class_year: string;
  class_name: string;
}

export interface CsvDownloadRequest {
  start_date?: string;
  end_date?: string;
  search_text?: string;
}

export interface BulkEditRequest {
  id: number;
  status: string;
}

export interface BaseSchoolEntity extends BaseDateCreated {
  id: number;
  name: string;
  code?: string;
  address: string;
  region: string;
  province: string;
  district: string;
  sub_district: string;
  post_code: string;
  latitude?: string | null;
  longtitude?: string | null;
  director?: string | null;
  deputy_director?: string | null;
  director_phone_number?: string | null;
  deputy_director_phone_number?: string | null;
  registrar?: string | null;
  registrar_phone_number?: string | null;
  academic_affair_head?: string | null;
  academic_affair_head_phone_number?: string | null;
  advisor?: string | null;
  advisor_phone_number?: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  school_affiliation_id: number;
  school_affiliation_type: string;
  school_affiliation_name: string;
  school_affiliation_short_name: string;
  school_affiliation_group: string;
}

export interface SchoolListQueryParams extends BasePaginationAPIQueryParams {
  school_affiliation_id?: string;
  province?: string;
}

export interface SchoolResponse extends BaseSchoolEntity {
  contract_count: number;
}

export interface SchoolByIdResponse extends BaseSchoolEntity {
  image_url: string | null;
  school_profile?: File;
}

export interface SchoolUpdateRequest
  extends Omit<BaseSchoolEntity, 'created_at' | 'created_by' | 'image_url'> {
  updated_by: string;
  school_profile?: File;
}

export interface SchoolCreateRequest
  extends Omit<
    BaseSchoolEntity,
    'id' | 'created_at' | 'updated_at' | 'updated_by' | 'image_url'
  > {
  created_by: string;
}

export interface SchoolAffiliation {
  id: number;
  school_affiliation_group: string;
  type: string;
  name: string;
  short_name: string;
}

export interface SchoolContract extends BaseDateCreated {
  school_id: number;
  school_name: string;
  contract_id: number;
  contract_name: string;
  school_affiliation_id: number;
  school_affiliation_name: string;
  start_date: string;
  end_date: string;
  contract_status: string;
}

export interface SchoolStudentList extends BaseDateCreated, BasePaginationAPIQueryParams {
  id: string;
  email: string | null;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  last_login: string | null;
  school_id: number;
  student_id: string;
  year: string;
  birth_date: string | null;
  nationality: string | null;
  ethnicity: string | null;
  religion: string | null;
  father_title: string | null;
  father_first_name: string | null;
  father_last_name: string | null;
  mother_title: string | null;
  mother_first_name: string | null;
  mother_last_name: string | null;
  parent_marital_status: string | null;
  parent_relationship: string | null;
  parent_title: string | null;
  parent_first_name: string | null;
  parent_last_name: string | null;
  house_number: string | null;
  moo: string | null;
  district: string | null;
  sub_district: string | null;
  province: string | null;
  post_code: string | null;
  oauth: AuthOauthEntity[];
  have_password?: boolean;
}

export interface StudentUpdate
  extends Omit<
    SchoolStudentList,
    | 'id'
    | 'have_password'
    | 'pin'
    | 'created_at'
    | 'created_by'
    | 'updated_at'
    | 'updated_by'
    | 'last_login'
    | 'oauth'
    | 'image_url'
  > {
  profile_image?: File | null;
}

export interface AuthOauthEntity {
  provider: string | null;
  user_id: string | null;
  subject_id: string | null;
}

export interface LevelPlayLog {
  academic_year: number;
  year: string;
  class: string;
  curriculum_group: string;
  subject: string;
  lesson_id: number;
  lesson: string;
  passed_level_count: number;
  total_level_count: number;
  point_count: number;
  total_point: number;
  play_count: number;
  avg_time_per_question: number;
  last_played: string;
}

export interface OptionInterface {
  id: number;
  name: string;
}

export interface UpdateUserPinRequest {
  user_id: string;
  pin: string;
}

/* school observer */
export interface IObserverAccess {
  observer_access_id: number;
  access_name: string;
}

export interface IObserverInput {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  profile_image_file: File | null;
  profile_path: string;
  status: string;
  email: string;
  observer_accesses: IObserverAccess[];
}

export interface IObserverRequest {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  profile_image?: string | File;
  status: string;
  email: string;
  observer_accesses: number[];
}

export interface IObserverResponse extends BaseDateCreated {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string | null;
  image_url: string | null;
  status: 'enabled' | 'disabled' | 'draft';
  last_login: string | null;
  have_password?: boolean;
  observer_accesses: IObserverAccess[]; // Or a more specific type if needed
}

export interface IObserverAccess {
  observer_access_id: number;
  access_name: string;
}

/* school announcer */
export interface SchoolAnnouncer extends UserEntity, BaseDateCreated {
  id: string;
  id_number?: string | null;
  last_login?: string | null;
  have_password?: boolean;
}

export interface CreatedSchoolAnnouncer extends CreatedUserEntity {
  school_id?: string;
}

// export type UpdatedSchoolAnnouncer = UpdatedUserEntity;
export interface UpdatedSchoolAnnouncer extends UpdatedUserEntity {}

export interface ClassYear {
  id: number;
  name: string;
  short_name: string;
}

export interface TeacherNoteRequest extends BasePaginationAPIQueryParams {
  academic_year?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
  curriculum_group_id?: string;
  lesson_id?: string;
  sub_lesson_id?: string;
  subject_id?: string;
}

export interface TeacherNoteResponse extends BaseDateCreated {
  comment_id: number;
  teacher: string;
  image_url?: string;
  academic_year: string;
  year: string;
  subject: string;
  lesson: string;
  lesson_index: string;
  sub_lesson: string;
  sub_lesson_index: string;
  level_index: string;
  text: string;
}

export interface FamilyInfoResponse {
  id: number;
  owner: string;
}

export interface SubjectListRequest extends BasePaginationAPIQueryParams {
  curriculum_group_id?: number;
  seed_year_name?: string;
}

export interface SubjectListResponse extends BaseDateCreated {
  subject_id: number;
  subject_name: string;
  platform: string;
  subject_group_id: number;
  subject_group_name: string;
  year_id: number;
  seed_year_name: string;
  curriculum_group_id: number;
  curriculum_group_name: string;
  status: string;
}

export interface SeedYearResponse extends BaseDateCreated {
  id: number;
  name: string;
  short_name: string;
  status: string;
}

export interface CurriculumGroupResponse extends BaseDateCreated {
  id: number;
  name: string;
  short_name: string;
  status: 'enabled' | 'disabled';
}

export interface ContractSubjectGroupRequest extends BasePaginationAPIQueryParams {
  curriculum_group_id?: number;
  seed_year_name?: string;
}

export interface ContractSubjectGroupResponse extends BaseDateCreated {
  contract_id: number;
  contract_name: string;
  subject_id: number;
  subject_name: string;
  subject_group_id: number;
  subject_group_name: string;
  curriculum_group_id: number;
  curriculum_group_name: string;
  year_id: number;
  seed_year_short_name: string;
  status: string;
}

export interface AdminLoginAsResponse {
  id: string;
  school_id: number;
  school_name: string;
  school_code: string;
  school_image_url: string;
  title: string;
  first_name: string;
  last_name: string;
  image_url: string;
  target_user_access_token: string;
  admin_user_id: string;
  roles: number[];
  teacher_roles: number[];
}
