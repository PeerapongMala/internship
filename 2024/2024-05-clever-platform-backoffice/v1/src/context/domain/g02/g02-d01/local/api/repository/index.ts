import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import {
  Learning,
  Content,
  Standard,
  LearningContent,
  Indicator,
  LearningStatus,
  Year,
  SubStandard,
  BulkEdit,
  IDownloadCsvFilter,
  IReport,
  SubCriteria,
} from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '../helper';

export interface LearningFilterQueryParams extends BasePaginationAPIQueryParams {
  year_id?: number;
  learning_area_id?: number;
  content_id?: number;
  criteria_id?: number;
  learning_content_id?: number;

  status?: LearningStatus;
}

export interface YearRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<Year>>;
}

export interface LearningAreaRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<Learning>>;
  GetById(id: number): Promise<DataAPIResponse<Learning>>;
  Create(learningArea: DataAPIRequest<Learning>): Promise<DataAPIResponse<Learning>>;
  Update(
    learningAreaId: number,
    learningArea: Partial<Learning>,
  ): Promise<DataAPIResponse<Learning>>;
  BulkEdit(learningAreas: Partial<BulkEdit>): Promise<DataAPIResponse<Learning>>;
  UploadCSV(file: File, curriculum_group_id: number): Promise<DataAPIResponse<Learning>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  // Delete(id: string): boolean;
}

export interface ContentRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<Content>>;
  GetById(id: number): Promise<DataAPIResponse<Content>>;
  Create(content: DataAPIRequest<Content>): Promise<DataAPIResponse<Content>>;
  Update(contentId: number, content: Partial<Content>): Promise<DataAPIResponse<Content>>;
  UploadCSV(file: File, curriculum_group_id: number): Promise<DataAPIResponse<Content>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  // Delete(id: string): boolean;
  BulkEdit(content: Partial<BulkEdit>): Promise<DataAPIResponse<Content>>;
}

export interface StandardRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<Standard>>;
  GetById(id: number): Promise<DataAPIResponse<Standard>>;
  Create(standard: DataAPIRequest<Standard>): Promise<DataAPIResponse<Standard>>;
  Update(
    standardId: number,
    standard: Partial<Standard>,
  ): Promise<DataAPIResponse<Standard>>;
  UploadCSV(file: File, curriculum_group_id: number): Promise<DataAPIResponse<Standard>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  BulkEdit(standard: Partial<BulkEdit>): Promise<DataAPIResponse<Standard>>;
}
export interface LearningContentRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<LearningContent>>;
  GetById(id: number): Promise<DataAPIResponse<LearningContent>>;
  Create(
    learningContent: DataAPIRequest<LearningContent>,
  ): Promise<DataAPIResponse<LearningContent>>;
  Update(
    learningContentId: number,
    learningContent: Partial<LearningContent>,
  ): Promise<DataAPIResponse<LearningContent>>;
  UploadCSV(
    file: File,
    curriculum_group_id: number,
  ): Promise<DataAPIResponse<LearningContent>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  BulkEdit(learningContent: Partial<BulkEdit>): Promise<DataAPIResponse<LearningContent>>;
}
export interface IndicatorRepository {
  Gets(
    curriculum_group_id: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<Indicator>>;
  GetById(id: number): Promise<DataAPIResponse<Indicator>>;
  Create(indicator: DataAPIRequest<Indicator>): Promise<DataAPIResponse<Indicator>>;
  Update(
    indicatorId: number,
    indicator: Partial<Indicator>,
  ): Promise<DataAPIResponse<Indicator>>;
  UploadCSV(file: File, curriculum_group_id: number): Promise<DataAPIResponse<Indicator>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  BulkEdit(indicator: Partial<BulkEdit>): Promise<DataAPIResponse<Indicator>>;
}

export interface SubStandardRepository {
  Gets(
    substandardId: number,
    substandardValue: string,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<SubStandard>>;
  GetById(id: number): Promise<DataAPIResponse<SubStandard>>;
  Create(substandard: DataAPIRequest<SubStandard>): Promise<DataAPIResponse<SubStandard>>;
  Update(
    substandardId: number,
    substandard: Partial<SubStandard>,
  ): Promise<DataAPIResponse<SubStandard>>;
  UploadCSV(file: File, subCriteriaId: number): Promise<DataAPIResponse<SubStandard>>;
  DownloadCSV(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  BulkEdit(substandard: Partial<BulkEdit>): Promise<DataAPIResponse<SubStandard>>;
  GetBySubStandard(
    curriculumGroupId: number,
    query: LearningFilterQueryParams,
  ): Promise<DataAPIResponse<SubCriteria[]>>;
  UpdateSubStandard(substandardId: number, query: any): Promise<DataAPIResponse<any>>;
}

export interface ReportRepository {
  Gets(
    subCriteriaId: number,
    query: LearningFilterQueryParams,
  ): Promise<PaginationAPIResponse<IReport>>;
}
