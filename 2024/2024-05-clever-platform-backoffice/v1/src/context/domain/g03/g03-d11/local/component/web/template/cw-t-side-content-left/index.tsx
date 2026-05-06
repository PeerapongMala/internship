import CWWhiteBox from '@global/component/web/cw-white-box';
import SelectChat from '../../atom/cw-a-select-chat';
import InputSearch from '../../atom/cw-a-input-search';
import ListGroupChat from '../../organism/cw-o-list-group-chat';
import { TAllChat, TRoomType } from '@domain/g03/g03-d11/local/types/chat';
import { TPagination } from '@domain/g01/g01-d09/local/types/pagination';
import { useEffect, useState } from 'react';
import CWSelect, { SelectOption } from '@component/web/cw-select';
import Label from '@domain/g06/g06-d05/local/component/web/atom/Label';
import API from '@domain/g03/g03-d04/local/api';
import { getUserData } from '@global/utils/store/getUserData';

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
  const userData = getUserData();

  const [academicYearOptions, setAcademicYearOptions] = useState<SelectOption[]>([]);
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>('');
  useEffect(() => {
    API.academicYear
      .GetAcademicYearRangesList({
        page: 1,
        limit: -1,
        school_id: +userData?.school_id,
      })
      .then((res) => {
        if (res.status_code === 200 && res.data.length > 0) {
          setAcademicYearOptions(
            res?.data.map((item) => ({
              label: item.name,
              value: item.name,
            })),
          );

          setFilterAcademicYear(String(userData?.academic_year));
        }
      });
  }, []);
  const handleChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterAcademicYear(event.target.value);
  };

  return (
    <CWWhiteBox className="flex h-full w-fit flex-col">
      <SelectChat value={roomType} handleSelectChange={handleRoomTypeChange} />
      <CWSelect
        className="mt-5 flex-none"
        options={academicYearOptions}
        value={filterAcademicYear}
        onChange={handleChangeFilter}
      />
      <div className="mt-[20px] flex-none">
        <InputSearch searchText={searchText} onSearchChange={onSearchChange} />
      </div>
      <div className="mt-[20px] flex-none border-t border-gray-300"></div>
      <div className="flex-auto overflow-y-auto">
        <ListGroupChat
          year={filterAcademicYear}
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
