import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetStudentChatListReq, TGetStudentChatListRes } from '../../../helper/chat';
import { AxiosResponse } from 'axios';
import {
  TChat,
  TMessage,
  TRoomType,
  TStudentMessage,
} from '@domain/g03/g03-d11/local/types/chat';

export const getStudentChatListApi = async (
  req: TGetStudentChatListReq,
): Promise<TStudentMessage[]> => {
  // /teacher-chat/v1/chats/student/school/:school_id?room_type=private&page=1&limit=10&subject_id=2
  const request = axiosWithAuth(`/teacher-chat/v1/chats/student/school/${req.schoolId}`, {
    params: {
      room_type: req.roomType,
      subjectId: req.subjectId,
      ...req.pagination,
    },
  });

  let response: AxiosResponse<TGetStudentChatListRes>;
  try {
    response = await request;
  } catch (error) {
    console.error('error get teacher chat list', error);
    throw error;
  }

  if (!response.data.data) return [] as TStudentMessage[];

  return response.data.data;
};
