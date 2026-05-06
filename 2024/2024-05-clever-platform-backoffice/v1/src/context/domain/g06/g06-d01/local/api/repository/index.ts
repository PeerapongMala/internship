import { AxiosResponse } from 'axios';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '../helper';
import { TGetSubjectBySchoolIDReq } from '../helper/admin-school';
import {
  GeneralTemplateDropdown,
  EStatusTemplate,
  GeneralTemplates,
  GradeTemplateContent,
  GradeTemplateRecord,
  Indicators,
  SubjectContent,
  TCreateGradeTemplateContent,
  Year,
} from '../type';
import { TSubject } from '@domain/g06/g06-d01/local/type/subject';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import { TPatchUpdateTemplateReq } from '../helper/grade';

export interface TemplateFilterQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
  year?: string;
  status?: EStatusTemplate;
}

export interface GeneralTemplatesQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
  status?: EStatusTemplate;
}

export interface OptionsQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
}

export interface TemplatesRepository {
  Gets(
    school_id: number,
    query: TemplateFilterQueryParams,
  ): Promise<PaginationAPIResponse<GradeTemplateRecord>>;
  GetById(id: number): Promise<DataAPIResponse<GradeTemplateContent>>;
  Create(
    template: TCreateGradeTemplateContent,
  ): Promise<DataAPIResponse<GradeTemplateContent>>;
  Update(
    templateId: number,
    template: TPatchUpdateTemplateReq,
  ): Promise<Omit<DataAPIResponse<GradeTemplateContent>, 'data'>>;
  UpdateDetail(
    templateId: number,
    template: Partial<GradeTemplateContent>,
  ): Promise<DataAPIResponse<GradeTemplateContent>>;
}

export interface SubjectsRepository {
  Gets(template_id: number): Promise<DataAPIResponse<SubjectContent>>;
  Update(
    template_id: number,
    subjects: Partial<SubjectContent>[],
  ): Promise<DataAPIResponse<SubjectContent>>;
}

export interface IndicatorsRepository {
  GetById(indicator_id: number): Promise<DataAPIResponse<Indicators>>;
  Update(
    indicator_id: number,
    indicators: Partial<Indicators>,
  ): Promise<DataAPIResponse<Indicators>>;
}

export interface GeneralTemplatesRepository {
  Gets(
    school_id: number,
    query: GeneralTemplatesQueryParams,
  ): Promise<PaginationAPIResponse<GeneralTemplates>>;
  GetById(id: number): Promise<DataAPIResponse<GeneralTemplates>>;
  Update(
    id: number,
    generalTemplates: Partial<GeneralTemplates>,
  ): Promise<DataAPIResponse<GeneralTemplates>>;
  Create(generalTemplates: GeneralTemplates): Promise<DataAPIResponse<GeneralTemplates>>;
}

export interface GeneralTemplateDropdownRepository {
  Gets(
    school_id: number,
    query: OptionsQueryParams,
  ): Promise<PaginationAPIResponse<GeneralTemplateDropdown>>;
}

export interface YearRepository {
  Gets(
    school_id: number,
    query: OptionsQueryParams,
  ): Promise<PaginationAPIResponse<Year>>;
}
export interface CleverPlatformRepository {
  Gets(
    school_id: number,
    query: OptionsQueryParams,
  ): Promise<PaginationAPIResponse<Year>>;
}

export interface AdminSchoolRepository {
  GetSubjectBySchoolID: (
    schoolID: string,
    options?: TGetSubjectBySchoolIDReq,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TSubject>>>;
}
