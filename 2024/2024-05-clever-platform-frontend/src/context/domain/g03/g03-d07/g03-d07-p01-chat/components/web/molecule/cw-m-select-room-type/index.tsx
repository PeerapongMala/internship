import { ERoomType } from '@domain/g03/g03-d07/local/api/helper/chat';
import CWSelect from '../../atom/cw-a-select';

type SelectRoomTypeProps = {
  value?: string;
  onChange?: (value: ERoomType) => void;
};
const SelectRoomType = ({ value, onChange }: SelectRoomTypeProps) => {
  const options: {
    key: string;
    value: ERoomType;
    label: string;
  }[] = [
    {
      key: ERoomType.CLASS,
      label: 'ห้องเรียน',
      value: ERoomType.CLASS,
    },
    {
      key: ERoomType.GROUP,
      label: 'กลุ่มเรียน',
      value: ERoomType.GROUP,
    },
    {
      key: ERoomType.SUBJECT,
      label: 'วิชา',
      value: ERoomType.SUBJECT,
    },
    {
      key: ERoomType.PRIVATE,
      label: 'ส่วนตัว',
      value: ERoomType.PRIVATE,
    },
  ];

  return (
    <CWSelect
      value={value}
      className=""
      title="แชทประจำวิชา"
      onChange={onChange}
      options={options}
    />
  );
};

export default SelectRoomType;
