import React, { useState, useEffect } from 'react';
import Box from '../../atom/Box';
import { toDateTimeTH } from '@global/utils/date';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import { LessonStatus } from '../../../Type';
import CWButton from '@component/web/cw-button';

interface SidePanelProps {
  userId?: string | number;
  time?: string;
  byAdmin?: string;
  statusValue?: LessonStatus;
  status?: (value: LessonStatus) => void;
  id?: string;
  onClick: () => void;
  role?: number[];
}

const SidePanel = ({
  time,
  byAdmin,
  statusValue,
  status,
  id,
  onClick,
  userId,
  role,
}: SidePanelProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    { value: LessonStatus.IN_USE, label: 'ใช้งาน' },
    { value: LessonStatus.DRAFT, label: 'แบบร่าง' },
    { value: LessonStatus.NOT_IN_USE, label: 'ไม่ใช้งาน' },
  ];

  useEffect(() => {
    if (statusValue) {
      const initialLabel =
        statusOptions.find((option) => option.value === statusValue)?.label ||
        'เลือกสถานะ';
      setSelectedStatus(initialLabel);
    }
  }, [statusValue]);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    onClick();
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const handleStatusChange = (selectedLabel: string) => {
    if (role?.length === 1 && role[0] === 2) return;
    const selectedOption = statusOptions.find((option) => option.label === selectedLabel);
    if (selectedOption && status) {
      setSelectedStatus(selectedLabel);
      status(selectedOption.value);
    }
  };

  return (
    <Box className="mt-5 max-h-[230px] rounded-lg bg-white p-3 shadow-md xl:mt-0 xl:w-[40%]">
      <div className="mb-3 grid grid-cols-2 items-center gap-2">
        <label className="text-[14px] text-gray-700">รหัสบทเรียนหลัก :</label>
        <p className="text-[14px]">{userId ? userId : '-'}</p>
      </div>

      <div className="mb-3 grid grid-cols-2 items-center gap-2">
        <label className="text-[14px] text-gray-700">สถานะ</label>
        <WCADropdown
          placeholder={selectedStatus || 'เลือกสถานะ'}
          options={statusOptions.map((option) => option.label)}
          onSelect={handleStatusChange}
          disabled={role?.length === 1 && role[0] === 2}
        />
      </div>

      <div className="mb-3 grid grid-cols-2 items-center gap-2">
        <label className="text-[14px] text-gray-700">แก้ไขล่าสุด</label>
        <p className="text-[14px]">{time ? toDateTimeTH(time) : '-'}</p>
      </div>

      <div className="mb-3 grid grid-cols-2 items-center gap-2">
        <label className="text-[14px] text-gray-700">แก้ไขโดย</label>
        <p className="text-[14px]">{byAdmin ? byAdmin : '-'}</p>
      </div>

      <div className="w-full mt-5">
        <CWButton
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          variant="primary"
          className="min-w-[250px] w-[425px] max-w-[430px] rounded-md py-2 font-bold text-white shadow-2xl"
          title={isSaving ? 'กำลังเพิ่มข้อมูล...' : 'บันทึก'}
        />
      </div>
    </Box>
  );
};

export default SidePanel;
