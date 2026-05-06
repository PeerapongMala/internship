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
    <div className={`mt-5 w-full rounded-lg bg-white p-3 shadow-md ${className}`}>
      <div className="mb-3 flex w-full flex-col items-center">
        <label className="mb-2 block w-full text-center text-sm font-bold text-gray-700">
          {titleName}
        </label>
        <p className="w-full text-center">{userId ? userId : '-'}</p>
      </div>
      <div className="mb-3 flex w-full flex-col items-center">
        <label className="mb-2 block w-full text-center text-sm font-bold text-gray-700">
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
          className="w-full"
        />
      </div>
      <div className="mb-3 flex w-full flex-col items-center">
        <label className="mb-2 block w-full text-center text-sm font-bold text-gray-700">
          แก้ไขล่าสุด
        </label>
        <p className="w-full text-center">{time ? toDateTimeTH(time) : '-'}</p>
      </div>
      <div className="mb-3 flex w-full flex-col items-center">
        <label className="mb-2 block w-full text-center text-sm font-bold text-gray-700">
          แก้ไขโดย
        </label>
        <p className="w-full text-center">{byAdmin ? byAdmin : '-'}</p>
      </div>
      <div className="mt-5 w-full">
        <button className="btn btn-primary w-full" onClick={onClick} disabled={isLoading}>
          {isLoading ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'บันทึก'}
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
