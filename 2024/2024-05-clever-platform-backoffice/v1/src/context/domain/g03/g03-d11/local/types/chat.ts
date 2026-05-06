/**
 * @id id of message
 * @content content of message
 * @pfp profile picture
 * @isLoginUser mock only. this for align text to right when chat from login user
 */
export type TMessage = {
  id: number;
  senderName: string;
  content: string;
  userAvatar?: string | null;
  isLoginUser?: boolean;
  isFirstMessage?: boolean;
  created_at: Date;
};
export type TStudentMessage = {
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
  class_name?: string;
  subject_name?: string;
};

export type TChat = {
  id: string;
  chatName: string;
  chatID: string;
  roomType: 'subject' | 'class' | 'group' | 'private';
  latestMsg: Pick<TMessage, 'content' | 'created_at'> | null;
  messages: TMessage[];
  memberCount: number;
  academicYear: number;
};

export type TAllChat = {
  [key: string]: TChat;
};

export type TChatSearchOption = {
  schoolId: string;
  name: string;
  roomType: TRoomType;
};
export type TChatStudentSearchOption = {
  schoolId: string;
  subjectId: string;
  roomType: TRoomType;
};

export type TRoomType = 'subject' | 'class' | 'group' | 'private' | 'all';

export type MList = {
  _pagination: Pagination;
  status_code: number;
  data: MListItem[];
  message: string;
};

export type MListItem = {
  user_id: string;
  title: string;
  first_name: string;
  last_name: string;
  image_Url: null | string;
};

export type Pagination = {
  page: number;
  limit: number;
  total_count: number;
};

export interface SendMessage {
  school_id: number;
  reciever_id: string;
}
