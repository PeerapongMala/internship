import { ERoomType } from '@domain/g03/g03-d07/local/api/helper/chat';
import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import { cn } from '@global/helper/cn';
import { HTMLAttributes, useMemo } from 'react';
import IconBook from '../../../../assets/icon-book.svg';
import IconClass from '../../../../assets/icon-class.svg';
import IconGroup from '../../../../assets/icon-group.svg';
import IconUser from '../../../../assets/icon-user.svg';
import Avatar from '../../atom/cw-a-avatar';

type ChatHeaderProps = HTMLAttributes<HTMLDivElement> & {
  room: TRoom;
};

const ChatHeader = ({ className, room }: ChatHeaderProps) => {
  const roomCode = useMemo(() => room.room_id?.padStart(3, '0'), [room.room_id]);

  return (
    <div className={cn('flex w-full gap-2 px-4 py-[6px]', className)}>
      {/* <Avatar className="h-10 w-10" src={room.image_url ?? undefined} /> */}
      <Avatar src={room.room_type === ERoomType.CLASS ? IconClass : room.room_type === ERoomType.GROUP ? IconGroup : room.room_type === ERoomType.SUBJECT ? room.image_url ?? IconBook : room.image_url ?? IconUser} />

      <div className="flex flex-1 flex-col">
        <span className="font-bold">{room.room_name}</span>
        <div className="text-[11px] text-[#333]">
          <span>รหัสห้องแชท{roomCode}, </span>
          <span>{room.member_count} คน</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
