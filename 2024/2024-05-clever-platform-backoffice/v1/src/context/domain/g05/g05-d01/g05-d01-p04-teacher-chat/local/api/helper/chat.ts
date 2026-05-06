import { TRoomType } from '../../types/chat';
import { TReqPagination, TResPagination } from './pagination';

export type TGetStudentChatListReq = {
  roomType: TRoomType | 'all';
  schoolId: string;
  subjectId?: string;
  pagination?: TReqPagination;
};

export type MGetListReq = {
  roomType: string | 'all';
  schoolId: string;
  searchText: string;
  roomId: string;
  academicYear?: number;
  pagination?: TReqPagination;
};
export type TGetChatListReq = {
  roomType: TRoomType | 'all';
  schoolId: string;
  name: string;
  pagination?: TReqPagination;
};
export type MGetListRes = TResPagination & {
  status_code: number;
  data:
    | {
        user_id: string;
        title: string;
        first_name: string;
        last_name: string;
        image_Url: null | string;
      }[]
    | null;
  message: string;
};
export type TGetChatListRes = TResPagination & {
  data:
    | {
        content: string;
        school_id: number;
        sender_id: string;
        sender_name: string;
        room_id: string;
        room_type: string;
        created_at: string;
        room_name: string;
        image_url: string | null;
        member_count: number;
        academic_year: number;
      }[]
    | null;
  message: string;
};
export type TGetStudentChatListRes = TResPagination & {
  data:
    | {
        content: string;
        school_id: number;
        sender_id: string;
        sender_name: string;
        room_id: string;
        room_type: string;
        created_at: string;
        room_name: string;
        image_url: string;
        member_count: number;
        private_class: string;
        class_name: string;
        subject_name: string;
      }[]
    | null;
  message: string;
};

export type TGetChatHistoryListReq = {
  schoolID: string;
  roomType: TRoomType;
  roomID: string;
  before?: Date;
};
export type TGetChatHistoryListRes = {
  message: string;
  data: {
    Message: {
      id: number;
      content: string;
      school_id: string;
      sender_id: string;
      reciever_id: string;
      room_id: string;
      room_type: string;
      created_at: string;
    };
    first_name: string;
    last_name: string;
    image_url: string | null;
  }[];
};
