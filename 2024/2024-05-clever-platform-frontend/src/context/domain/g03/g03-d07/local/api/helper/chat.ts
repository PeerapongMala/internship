import { TBaseResponse, TGetListResponse, TPaginationReq } from '../../types/api';
import { TRoom } from '../../types/room';

export enum ERoomType {
  SUBJECT = 'subject',
  CLASS = 'class',
  GROUP = 'group',
  PRIVATE = 'private',
  ALL = 'all',
}

export type TGetChatReq = TPaginationReq & {
  roomType: ERoomType;
  search?: string;
  schoolID: string;
};

export type TGetChatRes = TGetListResponse<
  Omit<TRoom, 'id' | 'created_at'> & {
    created_at: string | null;
  }
>;

export type TGetChatHistoryReq = {
  beforeDate?: string;
  schoolID: string;
  roomType: ERoomType;
  roomID: string;
};
export type TGetChatHistoryRes = TBaseResponse & {
  data: TWsMessageRes[];
};

export type TWsMessageRes = {
  Message: {
    id: number;
    content: string;
    school_id: number;
    sender_id: string;
    reciever_id: string;
    room_id: string;
    room_type: string;
    created_at: string;
  };
  first_name: string;
  last_name: string;
  image_url: string;
};
