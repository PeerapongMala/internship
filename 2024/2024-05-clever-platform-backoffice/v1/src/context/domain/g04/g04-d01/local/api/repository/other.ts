import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface ItemQueryParams extends BasePaginationAPIQueryParams {
  school_id?: number;
  year_id?: number;
  subject_id?: number;
  type?: string;
  id?: string;
  name?: string;
}

export interface OtherRepository {
  GetSchools(query: ItemQueryParams): Promise<PaginationAPIResponse<DropdownSchool>>;
  GetAcademicYears(
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownAcademicYear>>;
  GetAcademicYearsBySchoolId(
    schoolId: number,
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownAcademicYear>>;
  GetSubjects(query: ItemQueryParams): Promise<PaginationAPIResponse<DropdownSubject>>;
  GetYears(query: ItemQueryParams): Promise<PaginationAPIResponse<DropdownYear>>;
  GetArcadeGames(): Promise<PaginationAPIResponse<DropdownArcadeGame>>;
  GetItems(query: ItemQueryParams): Promise<PaginationAPIResponse<DropdownItem>>;
}
