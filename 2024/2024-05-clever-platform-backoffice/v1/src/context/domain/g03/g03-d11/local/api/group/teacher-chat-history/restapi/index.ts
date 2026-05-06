import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetChatHistoryListReq, TGetChatHistoryListRes } from '../../../helper/chat';
import dayjs from '../../../../../../../../global/utils/dayjs';
import { AxiosResponse } from 'axios';
import { TMessage } from '@domain/g03/g03-d11/local/types/chat';

export const getTeacherChatHistoryList = async (
  req: TGetChatHistoryListReq,
  loginUserID: string,
  abortController?: AbortController,
): Promise<TMessage[]> => {
  const params: { before?: string } = {};
  if (req.before) params.before = dayjs(req.before).toISOString();

  // req.roomID = req.roomID.split('-')[1];
  req.roomID = req.roomID.split(`${req.roomType}-`)[1];

  const request = axiosWithAuth(
    `/teacher-chat/v1/chatHistoryList/school/${req.schoolID}/room/${req.roomType}/id/${req.roomID}`,
    // `/teacher-chat/v1/teacher/chatHistoryList/school/${req.schoolID}/room/${req.roomType}/id/${req.roomID}`,
    {
      params: params,
      signal: abortController?.signal,
    },
  );

  let response: AxiosResponse<TGetChatHistoryListRes>;
  try {
    response = await request;
  } catch (error) {
    console.log(error);
    throw error;
  }

  if (response.data.data.length == 0) return [];

  // Transform Data
  const results: TMessage[] = response.data.data.map((data) => {
    const message: TMessage = {
      id: data.Message.id,
      content: data.Message.content,
      senderName: `${data.first_name.trim()} ${data.last_name.trim()}`,
      created_at: new Date(data.Message.created_at),
      isLoginUser: data.Message.sender_id === loginUserID,
      userAvatar: data.image_url,
    };

    return message;
  });

  return results;
};
