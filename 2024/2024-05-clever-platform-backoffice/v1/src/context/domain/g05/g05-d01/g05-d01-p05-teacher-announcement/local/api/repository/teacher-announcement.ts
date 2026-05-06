import {
  BaseAnnouncementEntity,
  AnnouncementListQueryParams,
  BulkEditRequest,
  CsvDownloadRequest,
} from '@domain/g03/g03-d10/local/type.ts';

import {
  PaginationAPIResponse,
  DataAPIResponse,
  BaseAPIResponse,
  DataAPIRequest,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface AnnouncementRepository {
  Gets(
    query: AnnouncementListQueryParams,
  ): Promise<PaginationAPIResponse<BaseAnnouncementEntity>>;

  GetById(announceId: number): Promise<DataAPIResponse<BaseAnnouncementEntity>>;

  Create(data: BaseAnnouncementEntity): Promise<BaseAPIResponse>;

  Update(announceId: number, data: BaseAnnouncementEntity): Promise<BaseAPIResponse>;

  BulkEdit(data: BulkEditRequest[]): Promise<BaseAPIResponse>;

  DownloadCSV(query: CsvDownloadRequest): Promise<Blob | FailedAPIResponse>;

  UploadCSV(file: File): Promise<BaseAPIResponse>;
}
