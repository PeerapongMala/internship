import { BaseAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { AnnouncementData } from '../type';

export interface RepositoryPatternInterface {
  Global: {
    Acivities: {
      Get(subjectId: string): Promise<PaginationAPIResponse<AnnouncementData>>;
      Read(announcementId: string): Promise<BaseAPIResponse>;
      ReadAll(subjectId: string): Promise<BaseAPIResponse>;
    };
    Mailboxes: {
      Get(subjectId: string): Promise<PaginationAPIResponse<AnnouncementData>>;
      Read(announcementId: string): Promise<BaseAPIResponse>;
      ReadAll(subjectId: string): Promise<BaseAPIResponse>;
      Delete(announcementId: string): Promise<BaseAPIResponse>;
      DeleteAllRead(subjectId: string): Promise<BaseAPIResponse>;
      ReceiveItem(subjectId: string, announcementId: string): Promise<BaseAPIResponse>;
    };
    Gifts: {
      Get(subjectId: string): Promise<PaginationAPIResponse<AnnouncementData>>;
      ReadAll(subjectId: string): Promise<BaseAPIResponse>;
      Delete(subjectId: string, rewardId: string): Promise<BaseAPIResponse>;
      DeleteAllRead(subjectId: string): Promise<BaseAPIResponse>;
      ReceiveItem(subjectId: string, rewardId: string): Promise<BaseAPIResponse>;
    };
    Notification: {
      Get(subjectId: string): Promise<PaginationAPIResponse<AnnouncementData>>;
      Read(announcementId: string): Promise<BaseAPIResponse>;
      ReadAll(subjectId: string): Promise<BaseAPIResponse>;
      Delete(announcementId: string): Promise<BaseAPIResponse>;
      DeleteAllRead(subjectId: string): Promise<BaseAPIResponse>;
    };
  };
}
