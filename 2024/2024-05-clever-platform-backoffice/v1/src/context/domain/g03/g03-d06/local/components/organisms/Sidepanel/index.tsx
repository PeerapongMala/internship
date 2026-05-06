import CWSelect from '@component/web/cw-select';
import { statusOptions } from '../../option';
import { Status } from '../../../type';
import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: Status;
  status?: (value: Status) => void;
  isLoading?: boolean;
  isEditMode?: boolean;

  onClick: () => void;
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
  isLoading,
  isEditMode,
}: SidePanelProps) => {
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
        <CWSelectValue
          options={[
            { value: Status.IN_USE, label: 'ใช้งาน' },
            { value: Status.DRAFT, label: 'แบบร่าง' },
            { value: Status.NOT_IN_USE, label: 'ไม่ใช้งาน' },
          ]}
          value={statusValue}
          onChange={(value: string) => {
            console.log('Status selected:', value);
            if (status) {
              status(value as Status);
            }
          }}
          required={true}
          title={'สถานะ'}
          className="col-span-2 w-full"
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
        <button className="btn btn-primary w-full" onClick={onClick} disabled={isLoading}>
          {isLoading ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'บันทึก'}
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
