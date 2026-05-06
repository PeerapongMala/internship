import CWSelect from '@component/web/cw-select';

import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import { Status, StatusReward } from '@domain/g03/g03-d07/local/type';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: StatusReward;
  status?: (value: StatusReward) => void;

  onClick?: () => void;
  data?: {
    id: number;
    updated_by: string;
    updated_at: string;
  }[];
  className?: string;
}

const SidePanel = ({
  titleName,
  time,
  byAdmin,
  onClick,
  userId,
  statusValue,
  status,
  data,
  className,
}: SidePanelProps) => {
  const statusOptions = [
    { value: StatusReward.IN_USE, label: 'ใช้งาน' },
    { value: StatusReward.SEND, label: 'ส่งแล้ว' },
    { value: StatusReward.RECEIVED, label: 'ได้รับแล้ว' },
    { value: StatusReward.RECALL, label: 'เรียกคืน' },
  ];
  const selectedLabel =
    statusOptions.find((option) => option.value === statusValue)?.label || 'เลือกสถานะ';

  const handleStatusChange = (selectedLabel: string) => {
    const selectedOption = statusOptions.find((option) => option.label === selectedLabel);
    if (selectedOption && status) {
      status(selectedOption.value);
    }
  };

  return (
    <div
      className={`mt-5 max-h-[250px] rounded-lg bg-white p-3 shadow-md xl:mt-0 xl:w-[30%] ${className} `}
    >
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          {titleName}
        </label>
        <p className="w-full">{userId ? userId : '-'}</p>
      </div>
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          สถานะ
        </label>
        <p className="w-full">{'-'}</p>
        {/* <WCADropdown
          placeholder={selectedLabel ? selectedLabel : "เลือกสถานะ"}
          options={statusOptions.map(option => option.label)}
          onSelect={handleStatusChange}
        /> */}
        {/* <CWSelectValue
          options={[
            { value: StatusReward.IN_USE, label: "ใช้งาน" },
            { value: StatusReward.SEND, label: "ส่งแล้ว" },
            { value: StatusReward.RECEIVED, label: "ได้รับแล้ว" },
            { value: StatusReward.RECALL, label: "เรียกคืน" },
          ]}
          value={statusValue}
          onChange={(value: string) => {
            console.log("Status selected:", value);
            if (status) {
              status(value as StatusReward);
            }
          }}
          required={true}
          title={"สถานะ"}
          className="col-span-2 w-full"
        /> */}
      </div>

      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          แก้ไขล่าสุด
        </label>
        <p className="w-full">{time ? toDateTimeTH(time) : '-'}</p>
      </div>
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          แก้ไขโดย
        </label>
        <p className="w-full">{byAdmin ? byAdmin : '-'}</p>
      </div>

      <div className="mt-5">
        <button
          className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
          onClick={onClick}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
