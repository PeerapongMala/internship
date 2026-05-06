import { useEffect, useRef, useState } from 'react';
import TeacherChatHeader from '../local/component/web/molecule/cw-m-header-chat';
import SideContentLeft from '../local/component/web/template/cw-t-side-content-left';
import SideContentRight from '../local/component/web/template/cw-t-side-content-right';
import { useChatStore } from '../local/stores/chat-list';
import StoreGlobalPersist from '@store/global/persist';
import {
  TChatSearchOption,
  TMessage,
  TRoomType,
  TStudentMessage,
} from '../local/types/chat';
import { ChatService } from '../local/services/chat';
import StoreGlobal from '@store/global';
import { useNavigate } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);
  const navigate = useNavigate();
  const userId = isLoginAs ? targetData?.id : userData?.id;
  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;

  const [ws, setWs] = useState<ChatService | null>(null);
  const [observerWs, setObserverWs] = useState<ChatService | null>(null);
  const [allChat, setAllChat] = useState<TStudentMessage[]>([]);
  console.log({ allChat: allChat });

  const [searchOption, setSearchOption] = useState<TChatSearchOption>({
    schoolId: schoolId,
    name: '',
    roomType: 'all',
  });

  // Error handling state
  const [chatError, setChatError] = useState<string | null>(null);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/chat') {
        navigate({ to: '/line/teacher/chat' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const {
    chatList,
    currentChatId,
    addMessage,
    setCurrentChatId,
    pagination,
    setPagination,
    fetchChatList,
    fetchChatStudentList,
    isFetchChatList,
    fetchMessages,
    fetchOldMessage,
    fetchAllChats,
    fetchAllMessages,
  } = useChatStore();

  // Add effect to fetch chat list and restore currentChatId
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setChatError(null);
        // First, fetch the chat list
        if (!isFetchChatList) {
          console.log('Fetching chat list on page load...');
          await fetchChatList(searchOption);

          // After chat list is loaded, check if we have a stored chat ID
          const storedChatId = sessionStorage.getItem('currentChatId');
          console.log('Stored chat ID from session:', storedChatId);

          if (storedChatId) {
            // Set the current chat ID
            setCurrentChatId(storedChatId);

            // Wait a bit to ensure the chat list is available
            setTimeout(() => {
              if (chatList[storedChatId]) {
                console.log('Fetching messages for stored chat ID:', storedChatId);
                fetchMessages(
                  storedChatId,
                  { ...searchOption, roomType: chatList[storedChatId].roomType },
                  userId,
                ).catch((error) => {
                  console.error('Error fetching messages:', error);
                  setChatError('ไม่สามารถโหลดข้อความได้ กรุณาลองใหม่อีกครั้ง');
                });
              } else {
                console.warn('Chat ID from session storage not found in chat list');
              }
            }, 300);
          }
        }
      } catch (error) {
        console.error('Error loading initial chat data:', error);
        setChatError('ไม่สามารถโหลดข้อมูลแชทได้ กรุณารีเฟรชหน้าเว็บ');
      }
    };

    fetchChatData();

    return () => ws?.close();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    // สร้าง Observer WebSocket สำหรับฟังทุกแชท
    const observer = new ChatService(
      schoolId,
      'all', // ฟังทุกประเภทห้อง
      '', // ID พิเศษ
      accessToken,
    );

    observer.observeSchoolChats(schoolId, accessToken);

    const observationHandler = (data: any) => {
      console.log('Observer received:', data);
      // if (data.event_type === 'new_message' || data.message_id) {
      //   showMessage(`มีแชทเข้ามาใหม่`, 'question');
      // }
      setAllChat(data);

      if (data.event_type === 'new_message') {
        const { room_id, room_type, message } = data;
        const chatId = `${room_type}-${room_id}`;

        const newMessage: TMessage = {
          id: message.id,
          content: message.content,
          created_at: new Date(message.created_at),
          senderName: message.sender_name,
          isLoginUser: message.sender_id === userId,
          userAvatar: message.sender_avatar,
        };

        addMessage(chatId, [newMessage], 'bottom');

        useChatStore.setState({ chatList: { ...chatList } });
      }
    };

    observer.addListener(observationHandler);
    setObserverWs(observer);

    return () => {
      observer.removeListener(observationHandler);
      observer.close();
    };
  }, []); // ขึ้นกับ schoolId และ userId เท่านั้น

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // ดึงข้อมูลแชททั้งหมด
        await fetchAllChats(schoolId, userId);

        // ดึง ID ของแชททั้งหมด
        const allChatIds = Object.keys(chatList);

        // ดึงข้อความของแชททั้งหมด
        if (allChatIds.length > 0) {
          await fetchAllMessages(allChatIds, searchOption, userId);
        }
      } catch (error) {
        console.error('Error loading all chat data:', error);
      }
    };

    loadAllData();
  }, [allChat]);

  useEffect(() => {
    if (chatList[currentChatId]) {
      fetchMessages(
        currentChatId,
        { ...searchOption, roomType: chatList[currentChatId].roomType },
        userId,
      );
    }
  }, [currentChatId]);

  // This effect updates the chat list when search options change
  useEffect(() => {
    // Skip if initial fetch is still in progress or if this is the first load
    if (isFetchChatList || sessionStorage.getItem('chatListInitialized') !== 'true') {
      // Mark as initialized after first load
      if (!isFetchChatList) {
        sessionStorage.setItem('chatListInitialized', 'true');
      }
      return;
    }

    console.log('Search options changed, refreshing chat list...');
    fetchChatList(searchOption);
  }, [searchOption]);

  // WebSocket
  useEffect(() => {
    // If no chat is selected, or the chat doesn't exist, don't try to connect
    const chatItem = chatList[currentChatId];
    if (!currentChatId || !chatItem) return;

    // Close any existing WebSocket before creating a new one
    if (ws) {
      console.log('Closing existing WebSocket before switching chats');
      ws.close();
      setWs(null);
    }

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

    // Create a new WebSocket connection for the selected chat
    console.log('Creating new WebSocket for chat:', currentChatId);
    const webSocket = new ChatService(
      schoolId,
      chatList[currentChatId].roomType ?? 'subject',
      chatList[currentChatId].chatID,
      accessToken,
    );

    // Add listener callback to handle incoming messages
    const messageHandler = (data: any) => {
      if (data?.Message) {
        console.log('Received WebSocket message:', data);

        const message: TMessage = {
          id: data.Message.id,
          content: data.Message.content,
          created_at: new Date(data.Message.created_at),
          senderName: `${data.first_name} ${data.last_name}`,
          isLoginUser: data.Message.sender_id === userId,
          userAvatar: data.image_url,
        };

        // Add the message to the current chat
        addMessage(currentChatId, [{ ...message }], 'bottom');

        // Use the debounced function to refresh the chat list to update latest message previews
        // debouncedRefreshChatList();
      }
    };

    webSocket.addListener(messageHandler);
    webSocket.connect();
    setWs(webSocket);

    return () => {
      webSocket.removeListener(messageHandler);
      webSocket.close();
    };
  }, [currentChatId]);

  const handleSubmitMessage = async (content: string) => {
    if (!currentChatId) return;

    ws?.sendMessage(content);
  };

  // Function to refresh chat list with debouncing
  const refreshChatListRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefreshChatList = () => {
    // Clear any existing timeout
    if (refreshChatListRef.current) {
      clearTimeout(refreshChatListRef.current);
    }

    // Set a new timeout
    refreshChatListRef.current = setTimeout(() => {
      console.log('Executing debounced chat list refresh');
      fetchChatList(searchOption)
        .then(() => {
          // If we have a current chat ID, make sure its messages are up-to-date
          if (currentChatId && chatList[currentChatId]) {
            console.log('Refreshing messages for current chat after chat list update');
            // No need to refresh messages as we'll get them through WebSocket
          }
        })
        .catch((error) => {
          console.error('Error refreshing chat list:', error);
        });
      refreshChatListRef.current = null;
    }, 500);
  };

  // Component cleanup effect
  // useEffect(() => {
  //   return () => {
  //     // Clean up WebSocket
  //     if (ws) {
  //       console.log('Cleaning up WebSocket connection');
  //       ws.close();
  //     }

  //     // Clean up any pending timeouts
  //     if (refreshChatListRef.current) {
  //       clearTimeout(refreshChatListRef.current);
  //       refreshChatListRef.current = null;
  //     }
  //   };
  // }, [ws]);

  return (
    <div className="mb-28 h-[80vh]">
      <TeacherChatHeader />

      {chatError && (
        <div
          className="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{chatError}</span>
          <button
            className="absolute bottom-0 right-0 top-0 px-4 py-3"
            onClick={() => setChatError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      <div className="mt-5 flex h-[70vh] flex-row justify-stretch gap-x-4">
        <SideContentLeft
          searchText={searchOption.name}
          chat={chatList}
          onSelectChat={(id) => {
            // Store the selected chat ID in session storage for persistence
            sessionStorage.setItem('currentChatId', id);

            // Set the current chat ID in the store
            setCurrentChatId(id);

            // First refresh the chat list to get any new messages
            fetchChatList(searchOption)
              .then(() => {
                // Then fetch the message history for the selected chat
                fetchMessages(
                  id,
                  { ...searchOption, roomType: chatList[id].roomType },
                  userId,
                );
              })
              .catch((error) => {
                console.error('Error refreshing chat list:', error);
                // Still try to fetch messages even if the chat list refresh fails
                fetchMessages(
                  id,
                  { ...searchOption, roomType: chatList[id].roomType },
                  userId,
                );
              });
          }}
          onSearchChange={(value) => {
            setSearchOption((prev) => ({ ...prev, name: value }));
          }}
          pagination={pagination}
          onSetPagination={setPagination}
          roomType={searchOption.roomType}
          handleRoomTypeChange={(type) =>
            setSearchOption((prev) => {
              if (type?.length == 0) type = 'all';

              return { ...prev, roomType: type };
            })
          }
        />
        <SideContentRight
          isHideContent={!ws}
          chat={chatList[currentChatId]}
          onSubmitMessage={handleSubmitMessage}
          handleFetchOldMessage={(abortController) =>
            fetchOldMessage(currentChatId, searchOption, userId, abortController)
          }
          onSearchOptionChange={(options) => setSearchOption(options)}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
