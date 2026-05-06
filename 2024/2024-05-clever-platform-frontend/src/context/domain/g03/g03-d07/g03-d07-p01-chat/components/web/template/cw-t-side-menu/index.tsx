import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import { ERoomType } from '@domain/g03/g03-d07/local/api/helper/chat';
import { TGetListResponse } from '@domain/g03/g03-d07/local/types/api';
import { TRoom } from '@domain/g03/g03-d07/local/types/room';
import axios from 'axios';
import { useEffect, useState } from 'react';
import API from '../../../../../local/api';
import CWInputSearch from '../../atom/cw-a-search-box';
import RoomList from '../../organism/cw-o-room-list';

type SideMenuProps = {
  schoolID: string;
  roomList: TRoom[];
  setRoomList: (rooms: TRoom[]) => void;
  selectedRoomID?: string;
  handleSelectRoomID?: (id: string) => void;
};

const SideMenu = ({
  schoolID,
  roomList,
  setRoomList,
  selectedRoomID,
  handleSelectRoomID,
}: SideMenuProps) => {
  const [roomType, setRoomType] = useState<ERoomType | ''>(ERoomType.ALL);
  const [searchText, setSearchText] = useState('');
  const [filterSubjects, setFilterSubjects] = useState<string[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>("");

  useEffect(() => {
    if (!schoolID) return;

    const controller = new AbortController();
    fetchRoomList(controller);

    return () => controller.abort();
  }, [schoolID, roomType, searchText]);

  const fetchRoomList = async (controller: AbortController) => {
    let data: TGetListResponse<TRoom>;

    const rt = roomType === '' ? ERoomType.ALL : roomType;
    try {
      data = await API.chat.GetRoomList(
        {
          schoolID,
          roomType: rt,
          search: searchText.length > 0 ? searchText : undefined,
        },
        controller,
      );
    } catch (error) {
      if (axios.isCancel(error)) return;

      throw error;
    }

    setRoomList(data.data);
  };
  const options = [
    'แชททั้งหมด',
    'แชทประจำวิชา',
    'แชทประจำชั้น',
    'แชทกลุ่มเรียน',
    'แชทกับครู',
  ];
  const keys = ['all', 'subject', 'class', 'group', 'private'];

  useEffect(() => {
    if (roomList.length > 0) {
      const years = Array.from(
        new Set(roomList
          .map(item => item.academic_year) // ดึง academic_year ออกมา
          .filter(year => year !== null && year !== undefined) // กัน null/undefined
        )
      ).sort((a, b) => b - a).map(String);;
      // const types = Array.from(
      //   new Set(
      //     roomList
      //       .flatMap(item => item.subject_name || []) // ถ้า subject_name เป็น null จะได้ []
      //       .filter(name => name !== null && name !== undefined) // กันเหนียว
      //   )
      // );
      setFilterSubject(years.length > 0 ? years[0] : "");
      setFilterSubjects(years);
    }
  }, [roomList])

  return (
    <div className="relative flex w-64 flex-col gap-2 rounded-md p-2 shadow-sm">
      <WCADropdown
        placeholder={roomType === '' ? 'แชททั้งหมด' : options[keys.indexOf(roomType)]}
        options={options}
        onSelect={(selected: string) =>
          setRoomType(keys[options.indexOf(selected)] as ERoomType)
        }
      />
      <WCADropdown
        placeholder={filterSubject}
        options={filterSubjects}
        onSelect={(selected: string) =>
          setFilterSubject(selected === "ทั้งหมด" ? "" : selected)
        }
      />
      {/* <SelectRoomType options[options.indexOf(roomType)] 
        value={roomType}
        onChange={(v) => {
          setRoomType(v);
          setSearchText('');
        }}
      /> */}
      <CWInputSearch placeholder="ค้นหา..." onSearchSubmit={(v) => setSearchText(v)} />
      <div className="relative h-[1px]">
        <div className="absolute h-[1px] w-full bg-neutral-200"></div>
      </div>
      <RoomList
        selectedRoomID={selectedRoomID}
        onSelectRoom={handleSelectRoomID}
        rooms={filterSubject === "" ? roomList : roomList.filter(room => room.academic_year === Number(filterSubject))}
        // rooms={filterSubject === "" ? roomList : roomList.filter(room => room.subject_name?.includes(filterSubject))}
      />
    </div>
  );
};

export default SideMenu;
