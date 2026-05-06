import CWWhiteBox from '@global/component/web/cw-white-box';
import HeaderNameChat from '../../molecule/cw-m-header-name-chat';
import InputMessage from '../../molecule/cw-m-input-message';
import ListMessageChat from '../../organism/cw-o-list-message-chat';
import { TChat, TChatSearchOption } from '@domain/g03/g03-d11/local/types/chat';
import { useEffect, useState } from 'react';
import { useChatStore } from '@domain/g03/g03-d11/local/stores/chat-list';

type SideContentRightProps = {
  isHideContent?: boolean;
  chat?: TChat;
  onSubmitMessage?: (content: string, form: HTMLFormElement) => void;
  handleFetchOldMessage?: (abortController?: AbortController) => Promise<void>;
  onSearchOptionChange?: (options: TChatSearchOption) => void;
};
const SideContentRight = ({
  isHideContent,
  chat,
  onSubmitMessage,
  handleFetchOldMessage,
  onSearchOptionChange,
}: SideContentRightProps) => {
  const [messageUpdateCounter, setMessageUpdateCounter] = useState(0);
  const { isFetchMessage } = useChatStore();

  // Force a re-render when chat messages change
  useEffect(() => {
    if (chat?.messages) {
      const filteredMessages = chat.messages.filter(
        (msg) => !msg.content.includes('_init_'),
      );
      console.log(
        'Chat messages changed in SideContentRight, message count:',
        filteredMessages.length,
      );
      setMessageUpdateCounter((prev) => prev + 1);
    }
  }, [chat?.messages]);

  console.log('Rendering SideContentRight, update counter:', messageUpdateCounter);
  if (!chat) {
    return (
      <CWWhiteBox className="flex h-[600px] flex-auto flex-col items-center justify-center">
        <p className="text-gray-500">กรุณาเลือกแชท</p>
      </CWWhiteBox>
    );
  }
  return (
    <CWWhiteBox className="fixed flex h-[600px] flex-auto flex-col">
      {!isHideContent && (
        <>
          <HeaderNameChat
            headerText={chat?.chatName}
            roomId={chat?.chatID ?? ''}
            subHeaderText={
              <span>
                รหัสห้องแชท:{' '}
                <span className="font-bold">{chat?.chatID?.padStart(3, '0')}</span>
              </span>
            }
            type={chat?.roomType ?? ''}
            src={chat?.messages[0]?.userAvatar ?? ''}
            onSearchOptionChange={onSearchOptionChange}
          />

          {isFetchMessage ? (
            <div className="flex w-full flex-grow flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อความ...</p>
            </div>
          ) : chat?.messages && chat.messages.length > 0 ? (
            <ListMessageChat
              key={`chat-messages-${messageUpdateCounter}`}
              messages={chat.messages}
              onScrollToTop={handleFetchOldMessage}
            />
          ) : (
            <div className="flex w-full flex-grow flex-col items-center justify-center">
              <p className="text-gray-500">ไม่มีข้อความในขณะนี้</p>
              <p className="text-sm text-gray-400">
                เริ่มต้นการสนทนาด้วยการส่งข้อความแรก
              </p>
            </div>
          )}

          <div className="sticky bottom-0">
            <InputMessage onSubmitMessage={onSubmitMessage} />
          </div>
        </>
      )}
    </CWWhiteBox>
  );
};

export default SideContentRight;
