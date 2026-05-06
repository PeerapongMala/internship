import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TMessage } from '@domain/g03/g03-d11/local/types/chat';
import { HTMLAttributes, useMemo } from 'react';

import IconUser from '@core/design-system/library/component/icon/IconUser';
import IconClass from '@global/asset/icon/class.svg';
import IconGroup from '@global/asset/icon/Group.svg';
import IconBook from '@global/asset/icon/Book.svg';
import dayjs from '@global/utils/dayjs';

type GroupChatProps = HTMLAttributes<HTMLButtonElement> & {
  name: string;
  latestMessage?: Partial<TMessage> | null;
  type?: 'class' | 'group' | 'private' | 'book';
  isActive?: boolean;
};

const GroupChat = ({
  name,
  latestMessage,
  onClick,
  type = 'private',
  isActive,
  className,
  ...props
}: GroupChatProps) => {
  const time = useMemo(() => {
    if (!latestMessage?.created_at) return undefined;
    const date = dayjs(latestMessage.created_at);
    const now = dayjs();

    if (now.diff(date, 'hour') < 24) {
      return date.format('hh:mm A');
    }
    if (now.diff(date, 'day') < 7) {
      return `${now.diff(date, 'day')} วันที่แล้ว`;
    }
    if (now.diff(date, 'year') < 1) {
      return `${now.diff(date, 'week')} สัปดาห์ที่แล้ว`;
    }
    return `${now.diff(date, 'year')} ปีที่แล้ว`;
  }, [latestMessage?.created_at]);

  const renderIcon = () => {
    if (type === 'class') return <IconClass />;
    if (type === 'group') return <IconGroup />;
    // if (type === 'private' && latestMessage?.userAvatar) {
    //   return (
    //     <img
    //       src={latestMessage.userAvatar}
    //       className="h-[30px] w-[30px] rounded-full"
    //       alt={name}
    //     />
    //   );
    // }
    if (type === 'private') return <IconUser />;
    // if (latestMessage?.userAvatar) {
    //   return (
    //     <img
    //       src={latestMessage.userAvatar}
    //       className="h-[30px] w-[30px] rounded-full"
    //       alt={name}
    //     />
    //   );
    // }
    return <IconBook />;
  };

  const displayMessage = useMemo(() => {
    if (!latestMessage?.content) return '\u00A0';
    return latestMessage.content.includes('_init_') ? '\u00A0' : latestMessage.content;
  }, [latestMessage?.content]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-[280px] items-center gap-2 overflow-x-hidden rounded-lg p-2 transition-colors hover:bg-slate-100',
        isActive && 'bg-slate-100',
        className,
      )}
      {...props}
    >
      <div className="flex-shrink-0">{renderIcon()}</div>

      <div className="flex flex-grow flex-col justify-between overflow-hidden py-2">
        <div
          className={cn(
            'truncate text-left text-sm font-medium',
            isActive ? 'text-primary' : 'text-dark',
          )}
        >
          {name}
        </div>
        <div className="min-h-[1em] truncate text-left text-xs text-gray-400">
          {displayMessage}
        </div>
      </div>

      {time && (
        <div
          className={cn(
            'w-[50px] flex-shrink-0 whitespace-nowrap text-right text-xs',
            isActive ? 'text-primary' : 'text-gray-400',
          )}
        >
          {time}
        </div>
      )}
    </button>
  );
};

export default GroupChat;
