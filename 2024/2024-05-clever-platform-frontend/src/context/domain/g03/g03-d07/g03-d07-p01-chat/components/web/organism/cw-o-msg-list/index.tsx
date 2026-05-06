import { TMessage } from '@domain/g03/g03-d07/local/types/msg';
import { cn } from '@global/helper/cn';
import dayjs from 'dayjs';
import { HTMLAttributes } from 'react';
import MsgItem from '../../molecule/cw-m-msg-item';
import TimeDisplayChat from '../../molecule/cw-m-time-display-chat';

type MsgListProps = HTMLAttributes<HTMLDivElement> & {
  messages: TMessage[];
  bottomRef: React.RefObject<HTMLDivElement>;
};

type DisplayFlags = {
  showTimeDisplayChat: boolean;
  showTimeDisplay: boolean;
  showAvatar: boolean;
};

/**
 * Returns flags that control when to show time display and avatar.
 * - For the first message, all flags are true.
 * - For subsequent messages:
 *    - If the diff is more than 10 minutes, showTimeDisplayChat is true.
 *    - If the diff is more than 3 minutes, showTimeDisplay is true.
 *    - Also, showAvatar is true when the diff is more than 3 minutes.
 */
const getDisplayFlags = (
  currentMsg: TMessage,
  previousMsg: TMessage | null,
): DisplayFlags => {
  if (!previousMsg) {
    return { showTimeDisplayChat: true, showTimeDisplay: true, showAvatar: true };
  }

  const diff = Math.abs(
    dayjs(previousMsg.message.createdAt).diff(currentMsg.message.createdAt, 'minute'),
  );

  return {
    showTimeDisplayChat: diff > 10,
    showTimeDisplay: diff > 3,
    showAvatar: diff > 3,
  };
};

const MsgList = ({ className, messages, bottomRef }: MsgListProps) => {
  return (
    <div className={cn('flex flex-col gap-2 overflow-y-auto px-4', className)}>
      {messages.map((msg, i) => {
        const previousMsg = i > 0 ? messages[i - 1] : null;
        const { showTimeDisplayChat, showTimeDisplay, showAvatar } = getDisplayFlags(
          msg,
          previousMsg,
        );

        return (
          <div key={msg.message.id || i}>
            {showTimeDisplayChat && <TimeDisplayChat inputDate={msg.message.createdAt} />}
            <MsgItem
              msg={msg}
              isShowMsgTime={showTimeDisplay}
              isShowAvatar={showAvatar}
            />
            {i === messages.length - 1 && <div ref={bottomRef} />}
          </div>
        );
      })}
    </div>
  );
};

export default MsgList;
