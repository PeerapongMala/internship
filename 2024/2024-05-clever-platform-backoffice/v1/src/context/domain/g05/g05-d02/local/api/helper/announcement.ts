import {
  TBasePaginationResponse,
  TBaseResponse,
  TPaginationReq,
} from '@domain/g06/g06-d02/local/types';
import { TAnnouncement } from '../../types/announcement';

export type TGetAnnouncementListReq = TPaginationReq & { user_id: string };
export type TGetAnnouncementListRes = TBasePaginationResponse<TAnnouncement>;

export type TGetAnnouncementReq = { announcement_id: string };
export type TGetAnnouncementRes = TBaseResponse<TAnnouncement>;
