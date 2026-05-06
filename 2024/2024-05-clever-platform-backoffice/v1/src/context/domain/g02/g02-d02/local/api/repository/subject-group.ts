import {
  ICreateSubjectGroup,
  IDownloadCsvFilter,
  ISubjectGroup,
  IUpdateSubjectGroup,
} from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface SubjectGroupRepository {
  GetAll(
    yearId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ISubjectGroup>>;
  GetById(subjectGroupId: ISubjectGroup['id']): Promise<DataAPIResponse<ISubjectGroup>>;
  Create(data: ICreateSubjectGroup): Promise<DataAPIResponse<ISubjectGroup>>;
  Update(
    subjectGroupId: ISubjectGroup['id'],
    data: IUpdateSubjectGroup,
  ): Promise<DataAPIResponse<ISubjectGroup>>;
  DownloadCsv(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
  UploadCsv(
    file: File | null,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<ISubjectGroup[]>>;
  BulkEdit(
    subjectGroups: Pick<ISubjectGroup, 'id' | 'status'>[],
    admin_login_as?: ISubjectGroup['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>>;
}
