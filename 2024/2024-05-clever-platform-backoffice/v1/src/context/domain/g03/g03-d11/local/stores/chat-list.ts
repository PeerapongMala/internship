import { create } from 'zustand';
import {
  TAllChat,
  TChat,
  TChatSearchOption,
  TChatStudentSearchOption,
  TMessage,
  TRoomType,
  TStudentMessage,
} from '../types/chat';
import { TPagination } from '../types/pagination';
import dayjs from '../../../../../global/utils/dayjs';
import { AxiosResponse } from 'axios';
import API from '../api';

interface ChatListStoreState {
  chatList: TAllChat;
  studentChatList: TStudentMessage[];
  currentChatId: string;
  isFetchChatList: boolean;
  isFetchStudentChatList: boolean;
  isFetchMessage: boolean;
  pagination: TPagination;

  setCurrentChatId: (id: string) => void;
  setPagination: (pagination: Partial<TPagination>) => void;

  fetchChatList: (searchOption: TChatSearchOption) => Promise<void>;
  fetchChatStudentList: (searchOption: TChatStudentSearchOption) => Promise<void>;
  fetchOldMessage: (
    chatID: string,
    searchOption: TChatSearchOption,
    userId: string,
    abortController?: AbortController,
  ) => Promise<void>;

  addMessage: (chatId: string, message: TMessage[], position: 'top' | 'bottom') => void;
  setMessage: (chatId: string, messages: TMessage[]) => void;
  fetchMessages: (
    chatID: string,
    searchOption: TChatSearchOption,
    userId: string,
  ) => Promise<void>;

  fetchAllChats: (schoolId: string, userId: string) => Promise<void>;
  fetchAllMessages: (
    chatIds: string[],
    searchOption: TChatSearchOption,
    userId: string,
  ) => Promise<void>;
}

const initialPagination: TPagination = {
  page: 1,
  limit: 10,
  total_count: 0,
};

export const useChatStore = create<ChatListStoreState>((set, get) => ({
  chatList: {},
  studentChatList: [],
  pagination: initialPagination,
  isFetchChatList: false,
  isFetchStudentChatList: false,
  isFetchMessage: false,
  currentChatId: '',

  fetchChatList: async (searchOption: TChatSearchOption) => {
    try {
      set(() => ({ isFetchChatList: true }));

      const results = await API.chatRepo.GetTeacherChatList({
        schoolId: searchOption.schoolId,
        roomType: searchOption.roomType || 'all',
        name: searchOption.name,
        pagination: { page: 1, limit: -1 }, // ดึงทั้งหมด
      });

      if (!results) return;

      set((state) => {
        const currentChatList = state.chatList;
        const updatedChatList: TAllChat = {};

        // รักษาข้อความเดิมไว้ถ้ามี
        results.forEach((newChat) => {
          updatedChatList[newChat.id] = {
            ...newChat,
            messages: currentChatList[newChat.id]?.messages || [],
          };
        });

        return {
          chatList: updatedChatList,
          isFetchChatList: false,
        };
      });
    } catch (error) {
      console.error('Error fetching chat list:', error);
      set(() => ({ isFetchChatList: false }));
      throw error;
    }
  },
  fetchChatStudentList: async (searchOption: TChatStudentSearchOption) => {
    let results: TStudentMessage[];

    const roomType = searchOption.roomType?.length == 0 ? 'all' : searchOption.roomType;

    try {
      set(() => ({ isFetchStudentChatList: true }));
      results = await API.chatRepo.GetStudentChatList({
        schoolId: searchOption.schoolId,
        roomType: roomType,
        subjectId: searchOption.subjectId,
      });
    } catch (error) {
      set(() => ({ isFetchStudentChatList: false }));
      console.error('Error fetching chat list:', error);
      throw error;
    }
    if (!results) return;

    set(() => ({ studentChatList: results, isFetchStudentChatList: false }));
  },

  fetchMessages: async (
    chatID: string,
    searchOption: TChatSearchOption,
    userId: string,
  ) => {
    if (get().isFetchMessage) return;

    set(() => ({ isFetchMessage: true }));

    // Clear existing messages first to avoid showing stale data
    if (get().chatList[chatID]) {
      set((state) => {
        const chat = state.chatList[chatID];
        return {
          chatList: {
            ...state.chatList,
            [chat.id]: {
              ...chat,
              messages: [], // Clear messages while fetching
            },
          },
        };
      });
    }

    let before: Date | undefined;
    const latestMsg = get().chatList[chatID].latestMsg ?? undefined;
    if (latestMsg?.created_at)
      before = dayjs(latestMsg.created_at).add(1, 'second').toDate();

    let messages: TMessage[];
    try {
      messages = await API.chatRepo.GetTeacherChatHistoryList(
        {
          roomID: chatID,
          roomType: searchOption.roomType,
          schoolID: searchOption.schoolId,
          before: before,
        },
        userId,
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set(() => ({ isFetchMessage: false }));
    }

    get().setMessage(chatID, messages);
  },

  fetchOldMessage: async (
    chatID: string,
    searchOption: TChatSearchOption,
    userId: string,
    abortController?: AbortController,
  ) => {
    const { isFetchMessage, chatList } = get();

    if (isFetchMessage) return;
    set(() => ({ isFetchMessage: true }));

    let messages: TMessage[];
    try {
      messages = await API.chatRepo.GetTeacherChatHistoryList(
        {
          roomID: chatID,
          roomType: chatList[chatID].roomType,
          schoolID: searchOption.schoolId,
          before: get().chatList[chatID].messages[0].created_at,
        },
        userId,
        abortController,
      );
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set(() => ({ isFetchMessage: false }));
    }

    if (!get().chatList[chatID]) return;
    const oldMessages = get().chatList[chatID].messages;
    const newMessages = messages.filter(
      (msg) => !oldMessages.some((oldMsg) => oldMsg.id === msg.id),
    );

    if (messages.length === 0) {
      oldMessages[0].isFirstMessage = true;
    }

    get().setMessage(chatID, [...newMessages, ...oldMessages]);
  },

  addMessage: (chatId: string, messages: TMessage[], position: 'top' | 'bottom') => {
    if (!get().chatList[chatId]) return;

    console.log('Adding message to chat store:', messages);

    set((state) => {
      const chat = state.chatList[chatId];
      const newMessages =
        position === 'top'
          ? [...messages, ...chat.messages]
          : [...chat.messages, ...messages];

      let latestMsg = chat.latestMsg;

      if (position === 'bottom' && messages.length > 0) {
        latestMsg = messages[messages.length - 1];
      }
      // ถ้าเพิ่มข้อความที่ด้านบน (เก่าสุด) แต่ไม่มี latestMsg อยู่ก่อนหน้า
      else if (!latestMsg && messages.length > 0) {
        latestMsg = messages[messages.length - 1];
      }

      const updatedChat = {
        ...chat,
        messages: newMessages,
        latestMsg: latestMsg,
      };

      // สร้าง chatList ใหม่โดยย้ายแชทนี้ไปบนสุด
      const newChatList = { ...state.chatList };
      delete newChatList[chatId]; // ลบออกจากตำแหน่งเดิม

      return {
        chatList: {
          [chatId]: updatedChat, // แชทที่อัปเดตแล้วอยู่บนสุด
          ...newChatList,
        },
      };
    });
  },

  setMessage: (chatId: string, messages: TMessage[]) => {
    if (!get().chatList[chatId]) return;

    set((state) => {
      const chat = state.chatList[chatId];
      return {
        chatList: {
          ...state.chatList,
          [chat.id]: {
            ...chat,
            messages: messages,
            latestMsg: messages.length > 0 ? messages[messages.length - 1] : null,
          },
        },
      };
    });
  },

  setCurrentChatId: (id) => {
    set(() => ({ currentChatId: id }));
  },

  setPagination: (pagination) => {
    set((state) => ({ pagination: { ...state.pagination, pagination } }));
  },

  fetchAllChats: async (schoolId: string, userId: string) => {
    try {
      const allChats = await API.chatRepo.GetTeacherChatList({
        schoolId,
        roomType: 'all',
        name: '',
        pagination: { page: 1, limit: -1 },
      });

      if (!allChats) return;

      set((state) => {
        const currentChatList = state.chatList;
        const updatedChatList: TAllChat = {};
        let validCurrentChatId = state.currentChatId;

        allChats.forEach((chat) => {
          // รักษาข้อความเดิมไว้ถ้ามี
          updatedChatList[chat.id] = {
            ...chat,
            messages: currentChatList[chat.id]?.messages || [],
            latestMsg: currentChatList[chat.id]?.latestMsg || null,
          };
        });

        // ตรวจสอบว่า currentChatId ยังมีอยู่หรือไม่

        return {
          chatList: updatedChatList,
          currentChatId: validCurrentChatId,
          isFetchChatList: false,
        };
      });
    } catch (error) {
      console.error('Error fetching all chats:', error);
      throw error;
    }
  },
  fetchAllMessages: async (
    chatIds: string[],
    searchOption: TChatSearchOption,
    userId: string,
  ) => {
    try {
      // กรองเฉพาะ chatIds ที่มีอยู่ใน chatList จริงๆ
      const validChatIds = chatIds.filter((id) => get().chatList[id]);

      // จำกัดจำนวน request พร้อมกันเพื่อป้องกัน overload
      const BATCH_SIZE = 5;
      const allMessages: TMessage[][] = [];

      for (let i = 0; i < validChatIds.length; i += BATCH_SIZE) {
        const batch = validChatIds.slice(i, i + BATCH_SIZE);

        const batchPromises = batch.map((chatId) =>
          API.chatRepo
            .GetTeacherChatHistoryList(
              {
                roomID: chatId,
                roomType: get().chatList[chatId].roomType || searchOption.roomType,
                schoolID: searchOption.schoolId,
                before: undefined,
              },
              userId,
            )
            .catch((error) => {
              console.error(`Error fetching messages for chat ${chatId}:`, error);
              return []; // Return empty array if error
            }),
        );

        const batchResults = await Promise.all(batchPromises);
        allMessages.push(...batchResults);
      }

      set((state) => {
        const updatedChatList = { ...state.chatList };

        validChatIds.forEach((chatId, index) => {
          if (updatedChatList[chatId] && allMessages[index]) {
            updatedChatList[chatId] = {
              ...updatedChatList[chatId],
              messages: allMessages[index],
              latestMsg: allMessages[index]?.[allMessages[index].length - 1] || null,
            };
          }
        });

        return {
          chatList: updatedChatList,
          isFetchMessage: false,
        };
      });
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  },
}));
