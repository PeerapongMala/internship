import CWButton from '@component/web/cw-button';

type SelectAllLevelActionProps = {
  disabled?: boolean;
  handleSelectAllLevels?: () => void;
  handleDeselectAllLevels?: () => void;
};

const SelectAllLevelAction = ({
  disabled,
  handleDeselectAllLevels,
  handleSelectAllLevels,
}: SelectAllLevelActionProps) => {
  return (
    <div className="flex justify-between border-b-[1px] py-5">
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold">เกณฑ์การประเมิน </span>
        <span className="text-sm text-neutral-500">
          คะแนนจะถูกคำนวณจากหัวข้อด้านล่างตามน้ำหนักที่กำหนด
        </span>
      </div>
      <div className="flex gap-5 py-2">
        <CWButton
          disabled={disabled}
          title="เลือกใช้ทั้งหมด"
          variant="primary"
          outline
          onClick={handleSelectAllLevels}
        />
        <CWButton
          disabled={disabled}
          title="ไม่เลือกทั้งหมด"
          variant="primary"
          outline
          onClick={handleDeselectAllLevels}
        />
      </div>
    </div>
  );
};

export default SelectAllLevelAction;
