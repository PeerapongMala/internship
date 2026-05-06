import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import {
  TGetAnnouncementListReq,
  TGetAnnouncementListRes,
  TGetAnnouncementReq,
  TGetAnnouncementRes,
} from '../../../helper/announcement';

export const getAnnouncementList = async (req: TGetAnnouncementListReq) => {
  let response: AxiosResponse<TGetAnnouncementListRes>;
  try {
    response = await axiosWithAuth.get(`/line-parent/v1/announcements/${req.user_id}`, {
      params: {
        page: req.page,
        limit: req.limit,
      },
    });
  } catch (error) {
    throw error;
  }

  return response;
};

export const getAnnouncement = async (req: TGetAnnouncementReq) => {
  let response: AxiosResponse<TGetAnnouncementRes>;
  try {
    response = await axiosWithAuth.get(
      `/line-parent/v1/announcement/${req.announcement_id}`,
      {},
    );
  } catch (error) {
    throw error;
  }

  return response;
};
