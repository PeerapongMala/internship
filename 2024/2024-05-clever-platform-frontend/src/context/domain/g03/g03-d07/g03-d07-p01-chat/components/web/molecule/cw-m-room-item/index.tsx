import { ERoomType } from '@domain/g03/g03-d07/local/api/helper/chat';
import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import { cn } from '@global/helper/cn';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import IconBook from '../../../../assets/icon-book.svg';
import IconClass from '../../../../assets/icon-class.svg';
import IconGroup from '../../../../assets/icon-group.svg';
import IconUser from '../../../../assets/icon-user.svg';
import Avatar from '../../atom/cw-a-avatar';

type RoomItemProps = {
  room: TRoom;
  isActive?: boolean;
  onClick?: (id: string) => void;
};

const RoomItem = ({ isActive, room, onClick }: RoomItemProps) => {
  const formattedDate = useMemo(() => {
    return room.created_at ? dayjs(room.created_at).format('HH:mm A') : null;
  }, [room.created_at]);

  return (
    <div
      className={cn(
        `flex rounded-md p-1 hover:cursor-pointer`,
        isActive ? 'bg-[#FCD401]' : 'hover:bg-[#e5e5e5]',
      )}
      onClick={() => onClick?.(room.id)}
    >
      <Avatar src={room.room_type === ERoomType.CLASS ? IconClass : room.room_type === ERoomType.GROUP ? IconGroup : room.room_type === ERoomType.SUBJECT ? room.image_url ?? IconBook : room.image_url ?? IconUser} />
      <div className="flex flex-1 flex-col ml-2">
        <span className="font-bold">{room.room_name}</span>
        <span className="text-xs"> {room.content ?? ''}</span>
      </div>
      <div className="text-xs">{formattedDate ?? ''}</div>
    </div>
  );
};

export default RoomItem;
