import { ERoomType } from '../api/helper/chat';

export type TMessage = {
  message: {
    id: number;
    content: string;
    schoolID: number;
    senderID: string;
    receiverID: string;
    roomID: string;
    roomType: ERoomType;
    createdAt: Date;
  };
  firstName: string;
  lastName: string;
  imgUrl: string;
  isLoggedUser?: boolean;
};

export interface TObserveMessage {
  message_id: number;
  sender_id: string;
  first_name: string;
  last_name: string;
  room_type: ERoomType;
  room_id: string;
  timestamp: Date;
  school_id: number;
  content: string;
}

export type TMessageList = {
  [key: string]: TMessage[];
};
