import { AxiosResponse } from 'axios';
import {
  TGetAnnouncementListReq,
  TGetAnnouncementListRes,
  TGetAnnouncementReq,
  TGetAnnouncementRes,
} from '../helper/announcement';
import { getAnnouncement, getAnnouncementList } from '../group/announcement/restapi';

export interface IAnnouncementRepository {
  GetAnnouncementList: (
    req: TGetAnnouncementListReq,
  ) => Promise<AxiosResponse<TGetAnnouncementListRes, any>>;

  GetAnnouncement: (
    req: TGetAnnouncementReq,
  ) => Promise<AxiosResponse<TGetAnnouncementRes, any>>;
}

export const AnnouncementRepository: IAnnouncementRepository = {
  GetAnnouncementList: getAnnouncementList,
  GetAnnouncement: getAnnouncement,
};
