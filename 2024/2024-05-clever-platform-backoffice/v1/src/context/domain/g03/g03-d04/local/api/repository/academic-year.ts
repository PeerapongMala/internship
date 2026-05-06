import {
  ClassesDropdownResponse,
  YearDropdownResponse,
  CreateAcademicYearRangesRequest,
  DeleteAcademicYearRangesRequest,
  GetAcademicYearRangesResponse,
  GetAcademicYearRangesRequest,
  GetClassResponse,
} from '@domain/g03/g03-d04/local/api/group/academic-year/type.ts';
import {
  DataAPIResponse,
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  school_id?: number;
  academic_year?: string;
  year?: string;
}
export interface AcademicYearRepository {
  GetDropdownAcademicYear(): Promise<DataAPIResponse<number[]>>;

  GetDropdownYear(academic_year: string): Promise<DataAPIResponse<YearDropdownResponse>>;

  GetDropdownClasses(
    academic_year: string,
    year: string,
  ): Promise<DataAPIResponse<ClassesDropdownResponse>>;

  GetAcademicYearRangesList(
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<GetAcademicYearRangesResponse>>;

  CreateAcademicYearRanges(
    data: CreateAcademicYearRangesRequest,
  ): Promise<BaseAPIResponse>;

  DeleteAcademicYearRanges(
    data: DeleteAcademicYearRangesRequest,
  ): Promise<BaseAPIResponse>;

  GetDropdownYearList(
    query: BasePaginationAPIQueryParams,
  ): Promise<DataAPIResponse<YearDropdownResponse>>;

  GetDropdownClassesList(
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<GetClassResponse>>;
}
