import React, { useState, useEffect } from 'react';
import Box from '../../atom/Box';
import CWSelectValue from '@component/web/cw-selectValue';
import { toDateTimeTH } from '@global/utils/date';
import { LessonStatus } from '../../../Type';
import CWButton from '@component/web/cw-button'; // Assuming you have CWButton imported
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import { useSubLessonFileUpdate } from '../../../hooks/useSubLessonFileUpdate';

interface SidePanelProps {
  time?: string;
  byAdmin?: string;
  onClick: () => void;
  statusSet: (value: LessonStatus) => void;
  id?: string | number;
  statusValue?: LessonStatus;
  fileUpdatedAt?: string | null;
  fileIsUpdated?: boolean;
  onFileUpdateSuccess?: () => void;
}

const statusOptions = [
  { value: LessonStatus.IN_USE, label: 'ใช้งาน' },
  { value: LessonStatus.DRAFT, label: 'แบบร่าง' },
  { value: LessonStatus.NOT_IN_USE, label: 'ไม่ใช้งาน' },
];

const SidePanel = ({
  time,
  byAdmin,
  statusSet,
  onClick,
  id,
  statusValue,
  fileIsUpdated,
  fileUpdatedAt,
  onFileUpdateSuccess,
}: SidePanelProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { handleSubLessonUpdate, isFetchSubLessonFileUpdate } = useSubLessonFileUpdate();

  useEffect(() => {
    if (statusValue) {
      const initialLabel =
        statusOptions.find((option) => option.value === statusValue)?.label ||
        'เลือกสถานะ';
      setSelectedStatus(initialLabel);
    }
  }, [statusValue]);

  const handleStatusChange = (selectedLabel: string) => {
    const selectedOption = statusOptions.find((option) => option.label === selectedLabel);
    if (selectedOption) {
      setSelectedStatus(selectedLabel);
      statusSet(selectedOption.value);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    onClick();
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <Box className="w-[40%] rounded-lg bg-white p-3 shadow-md">
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">รหัส</label>
        <p className="w-full">{id ? id : '-'}</p>
      </div>
      <div className="mb-3 flex items-center">
        <label className="mb-2 block w-[50%] text-sm font-bold text-gray-700">
          สถานะ
        </label>
        <WCADropdown
          placeholder={selectedStatus || 'เลือกสถานะ'}
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
      <div className="mt-5 flex flex-col gap-5">
        <CWButton
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          variant="primary"
          className="w-full rounded-md py-2 font-bold text-white shadow-2xl"
          title={isSaving ? 'กำลังเพิ่มข้อมูล...' : 'บันทึก'}
        />

        {id && (
          <CWButton
            disabled={fileIsUpdated || isFetchSubLessonFileUpdate}
            className="w-full"
            title={isFetchSubLessonFileUpdate ? 'กำลังอัปเดต...' : 'อัปเดต'}
            onClick={() => {
              if (!id) return;
              handleSubLessonUpdate([Number(id)], onFileUpdateSuccess);
            }}
          />
        )}
      </div>
    </Box>
  );
};

export default SidePanel;
