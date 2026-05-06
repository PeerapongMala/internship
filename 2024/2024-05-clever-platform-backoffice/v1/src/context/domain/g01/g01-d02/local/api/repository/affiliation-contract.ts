import { BaseAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';
import {
  AffiliationContract,
  CreatedAffiliationContract,
  School,
  SeedPlatform,
  Subject,
  UpdatedAffiliationContract,
} from '../../type';
import {
  DataAPIResponse,
  DataAPIRequest,
  PaginationAPIResponse,
  PaginationAPIQueryParamsWithUseStatus,
  BasePaginationAPIQueryParams,
} from '../helper';

export type AffiliationContractFilterQueryParams = PaginationAPIQueryParamsWithUseStatus;

export type AffiliationContractSubjectsFilterQueryParams =
  BasePaginationAPIQueryParams & {
    curriculum_group_id?: string;
    seed_year_id?: string;
  };

export type AffiliationContractSubjectGroupListFilterQueryParams =
  BasePaginationAPIQueryParams & {
    seed_year_id?: string;
  };

export interface AffiliationContractRepository {
  Gets(
    affiliationId: string,
    query: AffiliationContractFilterQueryParams,
  ): Promise<PaginationAPIResponse<AffiliationContract>>;
  // g01-d02-a29: a29-api-contract-get
  GetById(id: string): Promise<DataAPIResponse<AffiliationContract>>;
  // g01-d02-a14: a14-api-contract-create
  Create(
    data: DataAPIRequest<CreatedAffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>>;
  // g01-d02-a15: a15-api-contract-update
  Update(
    contractId: number,
    data: DataAPIRequest<UpdatedAffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>>;
  // g01-d02-a20: a20-api-contract-case-list-school
  GetSchoolsContract(
    contractId: string,
    query: PaginationAPIQueryParamsWithUseStatus,
  ): Promise<PaginationAPIResponse<School>>;
  // g01-d02-a25: a25-api-school-case-list-by-school-affiliation
  GetAllSchoolsInAffiliation(
    affiliationId: string,
    query?: PaginationAPIQueryParamsWithUseStatus,
  ): Promise<PaginationAPIResponse<School>>;
  // g01-d02-a19: a19-api-contract-case-list-subject-group
  GetSubjectsContract(
    contractId: string,
    query?: AffiliationContractSubjectsFilterQueryParams,
  ): Promise<PaginationAPIResponse<Subject>>;
  // g01-d02-a22: a22-api-curriculum-group-list
  GetCurriculumGroupList(
    query?: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<string>>;
  // g01-d02-a24: a24-api-subject-group-list
  GetSubjectGroupList(
    platformId: number,
    query?: AffiliationContractSubjectGroupListFilterQueryParams,
  ): Promise<PaginationAPIResponse<Subject>>;
  DownloadCSV(
    schoolAffiliationId: number,
    data: {
      start_date?: string;
      end_date?: string;
    },
  ): Promise<Blob | FailedAPIResponse>;
  GetSeedPlatformList(): Promise<DataAPIResponse<SeedPlatform[]>>;
  AddContractSchools(
    contractId: number,
    school_ids: number[],
  ): Promise<DataAPIResponse<number[]>>;
  AddContractSubjects(
    contractId: number,
    subjects: { subject_group_id: number; is_enabled: boolean }[],
  ): Promise<DataAPIResponse<{ subject_group_id: number; is_enabled: boolean }[]>>;
  GetSchoolAffiliationContacts(
    affiliationId: number,
    query?: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<AffiliationContract>>;
  DeleteContractSchool(
    contractId: number,
    school_ids: number[],
  ): Promise<DataAPIResponse<number[]>>;
  DeleteContractSubjectGroup(
    contractId: number,
    subject_group_ids: number[],
  ): Promise<DataAPIResponse<number[]>>;
  ToggleContractSubjectGroup(data: {
    contractId: number;
    subjectGroupId: number;
    is_enabled: boolean;
  }): Promise<BaseAPIResponse>;
  BulkEditContractSchools(
    bulk_edit_list: {
      school_affiliation_id: number;
      status: string;
    }[],
  ): Promise<DataAPIResponse<{ school_affiliation_id: number; status: string }[]>>;
  Refresh(contractId: number): Promise<BaseAPIResponse>;
}
