import { TGetListResponse } from '@domain/g03/g03-d07/local/types/api';
import { TMessage } from '@domain/g03/g03-d07/local/types/msg';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import {
  ERoomType,
  TGetChatHistoryReq,
  TGetChatHistoryRes,
} from '../../../../helper/chat';

export const getChatHistory = async (
  req: TGetChatHistoryReq,
  currentUserID: string,
  abortController?: AbortController,
): Promise<Omit<TGetListResponse<TMessage>, '_pagination'>> => {
  const params = {
    before: req.beforeDate,
  };

  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

  try {
    // Convert params to query string
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();

    // Fetch data using fetchWithAuth
    const reqString = queryParams
      ? `${backendURL}/teacher-chat/v1/chatHistoryList/school/${req.schoolID}/room/${req.roomType}/id/${req.roomID}`
      : `${backendURL}/teacher-chat/v1/chatHistoryList/school/${req.schoolID}/room/${req.roomType}/id/${req.roomID}?${queryParams}`;
    const response = await fetchWithAuth(reqString, {
      method: 'GET',
      signal: abortController?.signal,
    });

    // Parse the JSON response
    const data: TGetChatHistoryRes = await response.json();

    // Transform the response
    const transformedResponse: Omit<TGetListResponse<TMessage>, '_pagination'> = {
      ...data,
      data: data.data.map((item) => ({
        message: {
          id: item.Message.id,
          receiverID: item.Message.reciever_id,
          roomID: item.Message.room_id,
          roomType: item.Message.room_type as ERoomType,
          schoolID: item.Message.school_id,
          senderID: item.Message.sender_id,
          content: item.Message.content,
          createdAt: new Date(item.Message.created_at),
        },
        firstName: item.first_name,
        lastName: item.last_name,
        imgUrl: item.image_url,
        isLoggedUser: currentUserID === item.Message.sender_id,
      })),
    };

    return transformedResponse;
  } catch (error) {
    // Handle errors
    throw new Error(`Failed to fetch chat history: ${error}`);
  }
};
