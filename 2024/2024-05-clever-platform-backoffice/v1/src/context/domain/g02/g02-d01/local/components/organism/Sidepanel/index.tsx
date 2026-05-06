import { useState } from 'react';
import CWSelect from '@component/web/cw-select';
import { statusOptions } from '../../option';
import { LearningStatus } from '../../../type';
import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import CWButton from '@component/web/cw-button';

interface SidePanelProps {
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: LearningStatus;
  status?: (value: LearningStatus) => void;
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
}: SidePanelProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);

    onClick();

    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };
  const statusOptions = [
    { value: LearningStatus.IN_USE, label: 'ใช้งาน' },
    { value: LearningStatus.DRAFT, label: 'แบบร่าง' },
    { value: LearningStatus.NOT_IN_USE, label: 'ไม่ใช้งาน' },
  ];

  const getStatusLabel = (value?: LearningStatus) => {
    return statusOptions.find((option) => option.value === value)?.label || 'เลือกสถานะ';
  };

  return (
    <div
      className={`mt-5 max-h-[250px] rounded-lg bg-white p-3 shadow-md xl:mt-0 xl:w-[30%] ${className}`}
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
        <WCADropdown
          placeholder={getStatusLabel(statusValue)}
          options={statusOptions.map((option) => option.label)}
          onSelect={(selected) => {
            const selectedOption = statusOptions.find((opt) => opt.label === selected);
            if (selectedOption && status) {
              status(selectedOption.value);
            }
          }}
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
        <CWButton
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          variant="primary"
          className="min-w-[250px] w-[425px] max-w-[430px] rounded-md py-2 font-bold text-white shadow-2xl"
          title={isSaving ? 'กำลังเพิ่มข้อมูล...' : 'บันทึก'}
        />
      </div>
    </div>
  );
};

export default SidePanel;
