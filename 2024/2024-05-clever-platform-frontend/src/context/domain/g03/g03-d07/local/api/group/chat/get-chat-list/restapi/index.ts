import { TGetListResponse } from '@domain/g03/g03-d07/local/types/api';
import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { TGetChatReq, TGetChatRes } from '../../../../helper/chat';

const BACKEND_URL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const getChatList = async (
  req: TGetChatReq,
  abortController?: AbortController,
): Promise<TGetListResponse<TRoom>> => {
  const params = Object.entries({
    room_type: req.roomType,
    page: req.page,
    limit: req.limit,
    search: req.search,
  }).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string | number>,
  );

  try {
    // Convert params to query string
    const queryParams = new URLSearchParams(params as any).toString();

    // Fetch data using fetchWithAuth
    const response = await fetchWithAuth(
      `${BACKEND_URL}/teacher-chat/v1/chats/student/school/${req.schoolID}?${queryParams}`,
      {
        method: 'GET',
        signal: abortController?.signal,
      },
    );

    // Parse the JSON response
    const data: TGetChatRes = await response.json();

    // Ensure data.data is an array
    const chatData = Array.isArray(data.data) ? data.data : [];

    // Transform the response
    const transformedResponse: TGetListResponse<TRoom> = {
      ...data,
      data: chatData.map((room) => ({
        id: `${room.room_type}_${room.room_id}`,
        ...room,
        created_at: room.created_at ? new Date(room.created_at) : null,
      })),
    };

    return transformedResponse;
  } catch (error) {
    // Handle errors
    throw new Error(`Failed to fetch chat list: ${error}`);
  }
};
