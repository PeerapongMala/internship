import { SendMessage, TChat, TMessage, TStudentMessage } from '../../types/chat';
import { getMemberListApi, sendMessageFirst } from '../group/member-list/restapi';
import { getStudentChatListApi } from '../group/student-chat-list/restapi';
import { getTeacherChatHistoryList } from '../group/teacher-chat-history/restapi';
import { getTeacherChatListApi } from '../group/teacher-chat-list/restapi';
import {
  MGetListReq,
  MGetListRes,
  TGetChatHistoryListReq,
  TGetChatListReq,
  TGetStudentChatListReq,
} from '../helper/chat';

interface ChatApiRepository {
  GetMemberListApi: (req: MGetListReq) => Promise<MGetListRes>;
  GetTeacherChatList: (req: TGetChatListReq) => Promise<TChat[]>;
  GetStudentChatList: (req: TGetStudentChatListReq) => Promise<TStudentMessage[]>;
  GetTeacherChatHistoryList: (
    req: TGetChatHistoryListReq,
    loginUserID: string,
    abortController?: AbortController,
  ) => Promise<TMessage[]>;
  SendMessageFirst: (req: SendMessage) => Promise<SendMessage>;
}

export const chatApiRepo: ChatApiRepository = {
  GetMemberListApi: getMemberListApi,
  GetTeacherChatList: getTeacherChatListApi,
  GetStudentChatList: getStudentChatListApi,
  GetTeacherChatHistoryList: getTeacherChatHistoryList,
  SendMessageFirst: sendMessageFirst,
};
