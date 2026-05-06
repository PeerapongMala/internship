import { TGetListResponse } from '../../types/api';
import { TMessage } from '../../types/msg';
import { TRoom } from '../../types/room';
import { getChatHistory } from '../group/chat/get-chat-history/restapi';
import { getChatList } from '../group/chat/get-chat-list/restapi';
import { TGetChatHistoryReq, TGetChatReq } from '../helper/chat';

interface ChatRepository {
  GetRoomList: (
    req: TGetChatReq,
    abortController?: AbortController,
  ) => Promise<TGetListResponse<TRoom>>;
  GetChatHistory: (
    req: TGetChatHistoryReq,
    currentUserID: string,
    controller?: AbortController,
  ) => Promise<Omit<TGetListResponse<TMessage>, '_pagination'>>;
}

export const ChatRepository: ChatRepository = {
  GetRoomList: getChatList,
  GetChatHistory: getChatHistory,
};
