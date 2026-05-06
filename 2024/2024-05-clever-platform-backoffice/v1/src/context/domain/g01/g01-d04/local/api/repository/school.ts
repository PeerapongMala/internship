import {
  BulkEditRequest,
  ContractSubjectGroupRequest,
  ContractSubjectGroupResponse,
  CsvDownloadRequest,
  CurriculumGroupResponse,
  SchoolAffiliation,
  SchoolByIdResponse,
  SchoolContract,
  SchoolCreateRequest,
  SchoolListQueryParams,
  SchoolResponse,
  SchoolUpdateRequest,
  SeedYearResponse,
  SubjectListRequest,
  SubjectListResponse,
} from '@domain/g01/g01-d04/local/type.ts';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface SchoolRepository {
  // g01-d04-a01: school list
  Gets(query: SchoolListQueryParams): Promise<PaginationAPIResponse<SchoolResponse>>;

  // g01-d04-a02: school bulk edit
  BulkEdit(data: BulkEditRequest[]): Promise<void>;

  // g01-d04-a03: school CSV download
  DownloadCSV(query: CsvDownloadRequest): Promise<void>;

  // g01-d04-a04: school CSV upload
  UploadCSV(data: { file: File }): Promise<void>;

  // g01-d04-a05: school update
  Update(schoolId: string, data: SchoolUpdateRequest): Promise<void>;

  // g01-d04-a06: school create
  Create(data: SchoolCreateRequest): Promise<void>;

  // g01-d04-a07: get school by ID
  GetById(schoolId: string): Promise<SchoolByIdResponse>;

  // g01-d04-a08: school affiliations list
  GetSchoolAffiliations(
    query: BasePaginationAPIQueryParams & {
      type?: string;
      school_affiliation_group?: string;
    },
  ): Promise<PaginationAPIResponse<SchoolAffiliation>>;

  // g01-d04-a10: get school contracts list
  GetContractList(
    schoolId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SchoolContract>>;

  // g01-d04-a11-contract-subject-group
  GetContractSubjectGroup(
    schoolId: string,
    contractId: string,
    query: ContractSubjectGroupRequest,
  ): Promise<PaginationAPIResponse<ContractSubjectGroupResponse>>;

  // g01-d04-a12-school-subject
  GetSubjectList(
    schoolId: string,
    query: SubjectListRequest,
  ): Promise<PaginationAPIResponse<SubjectListResponse>>;

  // a22-api-curriculum-group-list
  GetCurriculumGroup(
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<CurriculumGroupResponse>>;

  // g01-d02-a48-api-seed-year-list
  GetSeedYear(
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<SeedYearResponse>>;

  // g01-d04-a65-school-provinces-list
  GetProvincesList(query: BasePaginationAPIQueryParams): Promise<
    PaginationAPIResponse<{
      province: string;
    }>
  >;

  SubjectUpdate(
    school_id: number,
    subject_id: number,
    is_enabled: boolean,
  ): Promise<DataAPIResponse<any>>;
}
