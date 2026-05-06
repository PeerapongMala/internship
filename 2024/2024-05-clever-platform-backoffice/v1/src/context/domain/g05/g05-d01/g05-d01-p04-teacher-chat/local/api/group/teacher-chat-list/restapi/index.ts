import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetChatListReq, TGetChatListRes } from '../../../helper/chat';
import { AxiosResponse } from 'axios';
import { TChat, TMessage, TRoomType } from '@domain/g03/g03-d11/local/types/chat';
import dayjs from '@global/utils/dayjs';

export const getTeacherChatListApi = async (req: TGetChatListReq): Promise<TChat[]> => {
  // const request = axiosWithAuth(`/teacher-chat/v1/teacher/chats/school/${req.schoolId}`, {
  // const request = axiosWithAuth(`/teacher-chat/v1/chats/teacher/school/${req.schoolId}`, {
  //   params: {
  //     room_type: req.roomType,
  //     search: req.name,
  //     ...req.pagination,
  //   },
  // });
  const params: any = {
    room_type: req.roomType,
    ...req.pagination,
  };

  if (req.name !== '') {
    params.search = req.name;
  }

  const request = axiosWithAuth(`/teacher-chat/v1/chats/teacher/school/${req.schoolId}`, {
    params,
  });

  let response: AxiosResponse<TGetChatListRes>;
  try {
    response = await request;
  } catch (error) {
    console.error('error get teacher chat list', error);
    throw error;
  }

  if (!response.data.data) return [] as TChat[];

  // ! room_id is separate by type. like room_id 1 can have in multiple type
  let results: TChat[] = response.data.data.map((data) => {
    let result: TChat = {
      id: `${data.room_type}-${data.room_id}`,
      chatID: `${data.room_type}-${data.room_id}`,
      chatName: data.room_name,
      roomType: data.room_type as 'subject' | 'class' | 'group' | 'private',
      latestMsg: data.content
        ? {
            content: data.content,
            created_at: dayjs(data.created_at).toDate(),
          }
        : null,
      messages: [],
      memberCount: data.member_count,
      academicYear: data.academic_year,
    };

    return result;
  });

  return results;
};
