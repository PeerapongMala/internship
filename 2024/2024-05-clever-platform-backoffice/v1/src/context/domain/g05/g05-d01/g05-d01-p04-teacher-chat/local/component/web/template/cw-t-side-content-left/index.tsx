import CWWhiteBox from '@global/component/web/cw-white-box';
import SelectChat from '../../atom/cw-a-select-chat';
import InputSearch from '../../atom/cw-a-input-search';
import ListGroupChat from '../../organism/cw-o-list-group-chat';
import { TAllChat, TRoomType } from '@domain/g03/g03-d11/local/types/chat';
import { TPagination } from '@domain/g01/g01-d09/local/types/pagination';
import { useEffect, useState } from 'react';
import CWSelect, { SelectOption } from '@component/web/cw-select';
import Label from '@domain/g06/g06-d05/local/component/web/atom/Label';

type SideContentLeftProps = {
  searchText: string;
  chat: TAllChat;
  onSelectChat?: (id: string) => void;
  pagination: TPagination;
  onSetPagination?: (pagination: Partial<TPagination>) => void;
  roomType: string;
  handleRoomTypeChange?: (value: TRoomType) => void;
  onSearchChange?: (value: string) => void;
};
const SideContentLeft = ({
  searchText,
  chat,
  onSelectChat,
  pagination,
  onSetPagination,
  roomType,
  handleRoomTypeChange,
  onSearchChange,
}: SideContentLeftProps) => {
  const [filterSubjects, setFilterSubjects] = useState<SelectOption[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>('');
  useEffect(() => {
    const chatArray = Object.values(chat); // แปลง object เป็น array ก่อน
    if (chatArray.length > 0) {
      const years = Array.from(
        new Set(
          chatArray
            .map((item) => item.academicYear) // พิมพ์ตรงนี้เป็น academicYear (ไม่ใช่ academic_year)
            .filter((year) => year !== null && year !== undefined),
        ),
      )
        .sort((a, b) => Number(b) - Number(a)) // เรียงจากมากไปน้อย
        .map((year) => {
          return { value: String(year), label: String(year) };
        }); // แปลงเป็น string

      // if (!filterSubject) { setFilterSubject(years.length > 0 ? years[0].value : "") }
      setFilterSubjects(years);
    }
  }, [chat]);
  const handleChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterSubject(event.target.value);
  };

  return (
    <CWWhiteBox className="flex h-full w-fit flex-col px-5">
      <SelectChat value={roomType} handleSelectChange={handleRoomTypeChange} />
      <CWSelect
        className="mt-5 flex-none"
        options={filterSubjects}
        value={filterSubject}
        onChange={handleChangeFilter}
      />
      <div className="mt-[20px] flex-none">
        <InputSearch searchText={searchText} onSearchChange={onSearchChange} />
      </div>
      <div className="mt-[20px] flex-none border-t border-gray-300"></div>
      <div className="flex-auto overflow-y-auto">
        <ListGroupChat
          year={filterSubject}
          chat={chat}
          onSelectChat={onSelectChat}
          pagination={pagination}
          onSetPagination={onSetPagination}
        />
      </div>
    </CWWhiteBox>
  );
};

export default SideContentLeft;
