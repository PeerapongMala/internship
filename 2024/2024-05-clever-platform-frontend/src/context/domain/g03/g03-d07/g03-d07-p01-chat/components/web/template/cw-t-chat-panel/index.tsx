import API from '@domain/g03/g03-d07/local/api';
import { ERoomType, TWsMessageRes } from '@domain/g03/g03-d07/local/api/helper/chat';
import { TMessage, TMessageList, TObserveMessage } from '@domain/g03/g03-d07/local/types/msg';
import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import { cn } from '@global/helper/cn';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import InputMsg from '../../molecule/cw-m-input-msg';
import ChatHeader from '../../organism/cw-o-chat-header';
import MsgList from '../../organism/cw-o-msg-list';

// const WS_URL = StoreGlobal.StateGetAllWithUnsubscribe().wsBaseURL;
const WS_URL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

type ChatPanelProps = HTMLAttributes<HTMLDivElement> & {
  room: TRoom;
  currentUserID: string;
  observerReconnectKey: number
  schoolID: string;
  setIsSessionExpired: (value: boolean) => void;
  onMessageObserve?: (message: TObserveMessage) => void
};

const ChatPanel = ({
  className,
  room,
  currentUserID,
  schoolID,
  observerReconnectKey,
  setIsSessionExpired,
  onMessageObserve
}: ChatPanelProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [msgList, setMsgList] = useState<TMessageList>({});
  const accessToken: string =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken || '';

  useEffect(() => {
    const controller = new AbortController();

    if (!msgList[room.id]) {
      setFirstMsgHistory(controller);
    }

    const ws = new WebSocket(
      `${WS_URL}/teacher-chat/v1/ws/school/${schoolID}/room/${room.room_type}/id/${room.room_id}?&token=${accessToken}`,
      // `${WS_URL}/teacher-chat/v1/teacher/ws/school/${schoolID}/room/${room.room_type}/id/${room.room_id}?token=${accessToken}`,
    );

    ws.onopen = () => {
      setWebSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data: TWsMessageRes = JSON.parse(event.data);

        const message: TMessage = {
          message: {
            id: data.Message.id,
            receiverID: data.Message.reciever_id,
            roomID: data.Message.room_id,
            roomType: data.Message.room_type as ERoomType,
            schoolID: data.Message.school_id,
            senderID: data.Message.sender_id,
            content: data.Message.content,
            createdAt: new Date(data.Message.created_at),
          },
          firstName: data.first_name,
          lastName: data.last_name,
          imgUrl: data.image_url,
          isLoggedUser: currentUserID === data.Message.sender_id,
        };

        setMsgList((prev) => {
          const newMessages: TMessage[] = prev[room.id];
          newMessages.push(message);

          // newMessage: newMessages,
          return {
            ...prev,
            [room.id]: newMessages,
          };
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    return () => {
      ws.close();
      controller.abort();
    };
  }, [room]);

  // observe web socket
  useEffect(() => {

    const ws = new WebSocket(
      `${WS_URL}/teacher-chat/v1/ws/observe/${schoolID}?&token=${accessToken}`,
    );

    ws.onopen = () => {
      console.log("[WebSocket:Observe] Connected!")
    }

    ws.onerror = (event) => {
      console.error('[WebSocket:Observe] Error occurred:', {
        event,
        readyState: ws.readyState, // 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
      });
    };

    ws.onclose = (event) => {
      console.warn('[WebSocket:Observe] Connection closed:', {
        code: event.code,        // e.g. 1006 = Abnormal Closure
        reason: event.reason,    // Often empty unless server provides it
        wasClean: event.wasClean // Boolean
      });
    };

    ws.onmessage = (event) => {
      try {
        const message: TObserveMessage = JSON.parse(event.data);

        if (message.room_type === ERoomType.PRIVATE) {
          message.room_id = `${message.room_type}_${message.sender_id}`
        } else {
          message.room_id = `${message.room_type}_${message.room_id}`
        }
        message.timestamp = new Date(message.timestamp)

        onMessageObserve?.(message)
      } catch (error) {
        console.error('Error parsing JSON at message observe:', error);
      }
    }

    return () => {
      ws.close()
    }

  }, [schoolID, observerReconnectKey])

  const handleSendMessage = (message: string) => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
      setIsSessionExpired(true);
      return;
    }
    webSocket?.send(message);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const setFirstMsgHistory = async (controller: AbortController) => {
    const response = await API.chat.GetChatHistory(
      {
        roomID: room.room_id,
        roomType: room.room_type,
        schoolID: schoolID,
      },
      currentUserID,
      controller,
    );

    if (response?.data?.length === 0) return;

    setMsgList((prev) => ({
      ...prev,
      [room.id]: response.data,
    }));
  };
  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-md shadow-sm overflow-hidden',
        className,
      )}
    >
      <ChatHeader className="border-b-[1px] border-neutral-200" room={room} />

      <div className="flex flex-1 flex-col justify-end overflow-y-auto">
        {msgList[room.id] && (
          <MsgList
            className="w-full"
            messages={msgList[room.id]}
            bottomRef={scrollContainerRef}
          />
        )}
      </div>

      <InputMsg
        className="h-fit flex-shrink-0 flex-grow-0"
        onSubmitMsg={handleSendMessage}
      />
    </div>
  );
};

export default ChatPanel;
