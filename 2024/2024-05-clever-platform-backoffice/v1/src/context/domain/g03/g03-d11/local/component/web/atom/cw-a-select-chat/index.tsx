import CWSelect from '@global/component/web/cw-select';
import { TRoomType } from '@domain/g03/g03-d11/local/types/chat';

type SelectChatProps = {
  value: string;
  handleSelectChange?: (value: TRoomType) => void;
};
const SelectChat = ({ value, handleSelectChange }: SelectChatProps) => {
  const chatOptions: {
    value: TRoomType;
    label: string;
  }[] = [
    { value: 'subject', label: 'แชทประจำวิชา' },
    { value: 'class', label: 'แชทประจำชั้น' },
    { value: 'group', label: 'แชทกลุ่มเรียน' },
    { value: 'private', label: 'แชทตัวต่อตัวนักเรียน' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSelectChange?.(event.target.value as TRoomType);
  };

  return (
    <CWSelect
      className="flex-none"
      title="แชททั้งหมด"
      options={chatOptions}
      value={value}
      onChange={handleChange}
    />
  );
};

export default SelectChat;
