import CWSelect from '@component/web/cw-select';

import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import { Status, StatusReward } from '@domain/g03/g03-d07/local/type';
import { BugReportStatus } from '@domain/g04/g04-d06/local/type';
import { CouponStatus } from '@domain/g04/g04-d05/local/type';
interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: CouponStatus;
  status?: (value: CouponStatus) => void;

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
  return (
    <div className={`h-full xl:w-[30%] ${className} `}>
      <div className="max-h-[350px] w-full rounded-lg bg-white p-3 shadow-md">
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
          <p className="col-span-2 w-full">เผยแพร่</p>
          {/* <CWSelectValue
            options={[
              { value: CouponStatus.WAITING, label: 'รอตรวจสอบ' },
              { value: CouponStatus.PUBLISH, label: 'เผยแพร่' },
              { value: CouponStatus.EXPIRE, label: 'หมดอายุ' },
            ]}
            value={statusValue}
            onChange={(value: string) => {
              console.log('Status selected:', value);
              if (status) {
                status(value as CouponStatus);
              }
            }}
            required={true}
            title={'สถานะ'}
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
    </div>
  );
};

export default SidePanel;
