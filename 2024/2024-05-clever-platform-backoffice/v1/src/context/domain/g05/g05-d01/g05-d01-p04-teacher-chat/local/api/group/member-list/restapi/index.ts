import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  MGetListReq,
  MGetListRes,
  TGetChatListReq,
  TGetChatListRes,
} from '../../../helper/chat';
import { AxiosResponse } from 'axios';
import {
  MList,
  SendMessage,
  TChat,
  TMessage,
  TRoomType,
} from '@domain/g03/g03-d11/local/types/chat';

import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';

export const getMemberListApi = async (req: MGetListReq): Promise<MGetListRes> => {
  const params: any = {
    ...req.pagination,
  };
  if (req.schoolId) {
    params.school_id = req.schoolId;
  }
  if (req.searchText) {
    params.search_text = req.searchText;
  }
  if (req.academicYear) {
    params.academic_year = req.academicYear;
  }

  const request = axiosWithAuth(
    `/teacher-chat/v1/rooms/${req.roomId}/members?room_type=${req.roomType}`,
    {
      params,
    },
  );

  let response: AxiosResponse<MGetListRes>;
  try {
    response = await request;
  } catch (error) {
    console.error('error get teacher chat list', error);
    throw error;
  }

  if (response.data.status_code != 200) return {} as MGetListRes;

  return response.data;
};
export const sendMessageFirst = async (req: SendMessage): Promise<SendMessage> => {
  const request = axiosWithAuth(
    `/teacher-chat/v1/init-message/${req.school_id}/${req.reciever_id}`,
    {
      method: 'POST',
      data: req,
    },
  );

  let response: AxiosResponse<SendMessage>;
  try {
    response = await request;
  } catch (error) {
    console.error('error get teacher chat list', error);
    throw error;
  }

  if (response.status != 200) return {} as SendMessage;

  return response.data;
};
