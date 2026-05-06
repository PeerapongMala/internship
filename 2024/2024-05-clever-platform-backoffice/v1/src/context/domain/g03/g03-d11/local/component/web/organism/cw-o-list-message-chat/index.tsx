import { TMessage } from '@domain/g03/g03-d11/local/types/chat';
import TimeDisplay from '../../molecule/cw-m-time-display';
import MessageBox from '../../molecule/cw-m-message-box';
import dayjs from '../../../../../../../../global/utils/dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

type ListMessageChatProps = {
  messages: TMessage[];
  onScrollToTop?: (abortController?: AbortController) => Promise<void>;
};

const ListMessageChat = ({ messages, onScrollToTop }: ListMessageChatProps) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [latestMsgID, setLatestMsgID] = useState<number | undefined>(undefined);

  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleScroll = () => {
    if (listRef.current) {
      if (messages[0]?.isFirstMessage) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      listRef.current.style.scrollBehavior = 'instant';

      const pixelThreshold = 20; // trigger when within 20px from the top

      if (scrollTop < lastScrollTop && scrollTop < pixelThreshold) {
        listRef.current.scrollTop = (scrollHeight - clientHeight) * 0.02;

        setIsFetchingHistory(true);
      }

      setLastScrollTop(scrollTop);
    }
  };

  useEffect(() => {
    if (isFetchingHistory) return;
    const abortController = new AbortController();
    handleFetchHistory(abortController);

    return () => {
      abortController.abort();
      setIsFetchingHistory(false);
    };
  }, [isFetchingHistory]);

  const handleFetchHistory = async (abortController: AbortController) => {
    setIsFetchingHistory(true);

    // await onScrollToTop?.(abortController);

    setIsFetchingHistory(false);
  };

  // Helper function to check if we're already near the bottom of the chat
  const isNearBottom = () => {
    if (!listRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    // Consider "near bottom" if within 100px of the bottom
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  // scroll to bottom when user send message
  useEffect(() => {
    // Only process if there are messages
    if (messages.length === 0) return;

    // Get the latest message
    const msg = messages[messages.length - 1];
    // console.log('Latest message in ListMessageChat:', msg);

    // If it's the same message we've already processed, don't do anything
    if (msg.id === latestMsgID) return;

    // Update the latest message ID we've seen
    setLatestMsgID(msg.id);

    // If this is our first message or we haven't set a latest message ID yet
    if (messages.length === 1 || !latestMsgID) {
      scrollToBottom();
      return;
    }

    // Auto-scroll to bottom for new messages from the current user
    // or if we're already near the bottom
    if ((latestMsgID < msg.id && msg.isLoginUser) || isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, latestMsgID]);

  const filteredMessages = useMemo(
    () => messages.filter((msg) => !msg.content.includes('_init_')),
    [messages],
  );

  return (
    <div
      className="flex w-full flex-grow flex-col gap-3 overflow-x-hidden px-4 pb-4"
      ref={listRef}
      onScroll={handleScroll}
    >
      {filteredMessages.map((msg, i) => (
        <div key={'msg_' + msg.id} className="flex flex-col gap-3">
          {i === 0 && isFetchingHistory && (
            <div className="flex w-full items-center justify-center">
              <AiOutlineLoading />
            </div>
          )}
          {/* แสดงตัวคั่นเฉพาะเมื่อเป็นคนละวัน */}
          {(i === 0 ||
            !dayjs(filteredMessages[i - 1]?.created_at).isSame(
              msg.created_at,
              'day',
            )) && <TimeDisplay time={msg.created_at} />}
          <MessageBox msg={msg} />
        </div>
      ))}
    </div>
  );
};

export default ListMessageChat;
