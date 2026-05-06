import CWSelectValue from '@component/web/cw-selectValue';
interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue: string;
  onClick: () => void;
  className?: string;
  onChange?: (value: string) => void;
  isDisable: boolean;
}

const SidePanel = ({
  titleName,
  time,
  byAdmin,
  onClick,
  userId,
  statusValue,
  className,
  onChange,
  isDisable,
}: SidePanelProps) => {
  return (
    <div
      className={`mt-5 max-h-[250px] rounded-lg bg-white p-3 shadow-md xl:mt-0 xl:w-[30%] ${className} `}
    >
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          {titleName}
        </label>
        <label className="w-full">{userId ? userId : '-'}</label>
      </div>
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          สถานะ
        </label>
        <p className="col-span-2 w-full">ใช้งาน</p>
        {/* <CWSelectValue
          options={[
            { value: 'enabled', label: 'เปิดใช้งาน' },
            { value: 'disabled', label: 'ไม่ใช้งาน' },
          ]}
          value={statusValue}
          onChange={(value: string) => {
            onChange?.(value);
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
        <p className="w-full">{time ? time : '-'}</p>
      </div>
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          แก้ไขโดย
        </label>
        <p className="w-full">{byAdmin ? byAdmin : '-'}</p>
      </div>

      <div className="mt-5">
        <button
          className="btn btn-primary w-full rounded-md py-2 font-bold text-white shadow-2xl"
          onClick={onClick}
          disabled={!isDisable}
        >
          บันทึก
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
