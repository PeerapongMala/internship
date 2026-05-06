import CWSelect from '@component/web/cw-select';
import { statusOptions } from '../../option';
import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import { Status, StatusReward } from '@domain/g03/g03-d07/local/type';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import { StoreStatus } from '@domain/g03/g03-d09/local/api/type';
interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: 'pending' | 'enabled' | 'expired';
  status?: (value: 'pending' | 'enabled' | 'expired') => void;

  onClick?: () => void;
  data?: {
    id: number;
    updated_by: string;
    updated_at: string;
  }[];
  className?: string;
}

const CWSidePanelShop = ({
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
    { value: 'enabled', label: 'เผยแพร่' },
    { value: 'pending', label: 'รอเผยแพร่' },
  ];
  const selectedLabel =
    statusOptions.find((option) => option.value === statusValue)?.label || 'เลือกสถานะ';

  const handleStatusChange = (selectedLabel: string) => {
    const selectedOption = statusOptions.find((option) => option.label === selectedLabel);
    if (selectedOption && status) {
      status(selectedOption.value as 'pending' | 'enabled' | 'expired');
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
      <div className="mb-3 flex w-full items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          สถานะ
        </label>
        <WCADropdown
          placeholder={selectedLabel ? selectedLabel : 'เลือกสถานะ'}
          options={statusOptions.map((option) => option.label)}
          onSelect={handleStatusChange}
        />
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

export default CWSidePanelShop;
