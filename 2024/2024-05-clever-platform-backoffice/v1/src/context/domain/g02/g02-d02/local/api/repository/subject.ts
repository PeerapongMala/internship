import { ICreateSubject, IDownloadCsvFilter, ISubject, IUpdateSubject } from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface SubjectQueryParams extends BasePaginationAPIQueryParams {
  subject_group_id?: number;
  year_id?: number;
}

export interface SubjectRepository {
  GetAll(
    subjectGroupId: number,
    curriculumGroupId: number,

    query: SubjectQueryParams,
  ): Promise<PaginationAPIResponse<ISubject> | FailedAPIResponse>;
  GetById(id: number): Promise<DataAPIResponse<ISubject>>;
  Create(data: DataAPIRequest<ISubject>): Promise<DataAPIResponse<ISubject>>;
  Update(
    subjectId: ISubject['id'],
    data: DataAPIRequest<ISubject>,
  ): Promise<DataAPIResponse<ISubject>>;
  DownloadCsv(
    subjectGroupId: number,
    filter: IDownloadCsvFilter,
  ): Promise<void | FailedAPIResponse>;
  UploadCsv(
    subjectGroupId: number,
    file: File | null,
  ): Promise<DataAPIResponse<undefined>>;
  BulkEdit(
    subjects: Pick<ISubject, 'id' | 'status'>[],
    admin_login_as?: ISubject['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>>;
}
