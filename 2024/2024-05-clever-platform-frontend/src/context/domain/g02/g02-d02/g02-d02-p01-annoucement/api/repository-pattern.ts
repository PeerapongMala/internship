import { BaseAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { AnnounceData } from '../type';

export interface RepositoryPatternInterface {
  Global: {
    Announcement: {
      School: { Get(): Promise<PaginationAPIResponse<AnnounceData>> };
      System: { Get(): Promise<PaginationAPIResponse<AnnounceData>> };
      ReadById: {
        Patch(announcementId: number): Promise<BaseAPIResponse>;
      };
      ReadAllSystem: { Post(): Promise<BaseAPIResponse> };
      ReadAllSchool: { Post(): Promise<BaseAPIResponse> };
    };
  };
}
