import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TMessage } from '@domain/g03/g03-d11/local/types/chat';
import { Avatar } from '@mantine/core';
import TimeDisplayChat from '../../atom/cw-a-time-display';

type MessageBoxProps = {
  msg: TMessage;
  className?: string;
};

const MessageBox = ({ msg, className }: MessageBoxProps) => {
  const isLoginUser = msg.isLoginUser;

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        isLoginUser ? 'flex-row-reverse' : 'flex-row',
        className,
      )}
    >
      {!isLoginUser && (
        <div className="flex-shrink-0">
          {msg.userAvatar ? (
            <img
              src={msg.userAvatar}
              className="h-[30px] w-[30px] rounded-full object-cover"
              alt={msg.senderName}
            />
          ) : (
            <Avatar size={30} />
          )}
        </div>
      )}

      <div
        className={cn(
          'flex max-w-[60%] flex-col',
          isLoginUser ? 'items-end' : 'items-start',
        )}
      >
        {!isLoginUser && (
          <div className="mb-1 text-xs text-gray-600">{msg.senderName}</div>
        )}

        <div className="flex items-end gap-2">
          {isLoginUser && (
            <TimeDisplayChat
              className="text-xs text-gray-500"
              inputDate={msg.created_at}
            />
          )}

          <div
            className={cn(
              'flex w-fit max-w-full whitespace-pre-wrap break-all rounded-t-lg px-4 py-2',
              isLoginUser
                ? 'rounded-bl-lg bg-primary text-white'
                : 'rounded-br-lg bg-slate-200 text-gray-800',
            )}
          >
            {msg.content}
          </div>

          {!isLoginUser && (
            <TimeDisplayChat
              className="text-xs text-gray-500"
              inputDate={msg.created_at}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
