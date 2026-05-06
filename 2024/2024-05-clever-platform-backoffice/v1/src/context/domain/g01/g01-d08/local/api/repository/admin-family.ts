import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import {
  FamilyListResponse,
  FamilyMemberListByParentResponse,
  FamilyMemberListByStudentResponse,
  ParamsBulkEdit,
  ParamsDownloadCsv,
  ParamsSaveAdminFamily,
  ParamsFamilyMemberListByParent,
  ParamsBulkEditMemberListByParent,
  ParamsFamilyMemberListByStudent,
  FamilyMemberResponse,
  ParamsStudentList,
  DropdownSchoolListResponse,
  DropdownYearListRequest,
  DropdownClassListRequest,
  DropdownClassListResponse,
} from '../group/admin-family/type';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  [key: string]: any;
  debouncedFilterSearch?: { key: string; value: string };
}

export interface AdminFamilyRepository {
  GetFamilyList(
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FamilyListResponse>>;
  GetFamilyInfo(family_id: number): Promise<DataAPIResponse<FamilyListResponse>>;

  GetFamilyMemberListByParent(
    family_id: number,
    query?: ParamsFamilyMemberListByParent,
  ): Promise<PaginationAPIResponse<FamilyMemberListByParentResponse>>;

  GetFamilyMemberListByStudent(
    family_id: number,
    query?: ParamsFamilyMemberListByStudent,
  ): Promise<PaginationAPIResponse<FamilyMemberListByStudentResponse>>;

  PatchFamilyStatus(family_id: number, status: string): Promise<BaseAPIResponse>;

  DownloadFamilyList(
    family_id: string,
    query?: ParamsDownloadCsv,
  ): Promise<Blob | FailedAPIResponse>;

  BulkEditFamilyList(family_ids: number[]): Promise<BaseAPIResponse>;

  GetParentList(
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<FamilyMemberListByParentResponse>>;

  SaveAdminFamily(data: ParamsSaveAdminFamily): Promise<BaseAPIResponse>;

  AddFamilyMember(users_id: string[], family_id: string): Promise<BaseAPIResponse>;

  GetFamilyMemberOwner(
    family_id: number,
  ): Promise<PaginationAPIResponse<FamilyListResponse>>;

  UpdateFamilyOwner(family_id: number, user_id: string): Promise<BaseAPIResponse>;

  BulkEditMemberListByParent(
    family_id: number,
    data: ParamsBulkEditMemberListByParent,
  ): Promise<BaseAPIResponse>;

  DeleteMemberListByParent(family_id: number, user_id: string): Promise<BaseAPIResponse>;

  GetStudentList(
    query: BasePaginationAPIQueryParams & ParamsStudentList,
  ): Promise<PaginationAPIResponse<FamilyMemberResponse>>;

  GetDropdownSchoolList(): Promise<PaginationAPIResponse<DropdownSchoolListResponse>>;

  GetDropdownAcademicYearList(): Promise<PaginationAPIResponse<number[]>>;

  GetDropdownYearList(
    query: DropdownYearListRequest,
  ): Promise<PaginationAPIResponse<string[]>>;

  GetDropdownClassList(
    query: DropdownClassListRequest,
  ): Promise<PaginationAPIResponse<DropdownClassListResponse>>;

  DeleteFamily(family_id: number, password: string): Promise<BaseAPIResponse>;
}
