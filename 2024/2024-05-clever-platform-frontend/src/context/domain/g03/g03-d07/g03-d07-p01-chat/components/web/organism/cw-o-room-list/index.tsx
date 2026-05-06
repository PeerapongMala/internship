import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import RoomItem from '../../molecule/cw-m-room-item';

type RoomListProps = {
  rooms: TRoom[];
  selectedRoomID?: string;
  onSelectRoom?: (id: string) => void;
};

const RoomList = ({ rooms, selectedRoomID, onSelectRoom }: RoomListProps) => {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden w-60">
      {rooms &&
        rooms.map((room,index) => (
          <RoomItem
            key={index}
            isActive={selectedRoomID === room.id}
            room={room}
            onClick={onSelectRoom}
          />
        ))}
    </div>
  );
};

export default RoomList;
