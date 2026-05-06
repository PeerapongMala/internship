import { CoverPageData, IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import Label from '../../../../../local/component/web/atom/Label';
import FormRow from '../FormRow';
import { useState } from 'react';

interface StatProps {
  data: IGetPhorpor5Detail[];
  editable?: boolean;
  onStatusChange?: (status: CoverPageData['student_status']) => void;
}

export default function Stat({ data, editable = false, onStatusChange }: StatProps) {
  if (!data[0]?.data_json || !('student_status' in data[0]?.data_json)) return null;

  const coverData = data[0]?.data_json as CoverPageData;
  const [status, setStatus] = useState(coverData.student_status);

  const handleChange = (field: keyof typeof status, value: string) => {
    // แก้ไขให้รับค่าติดลบได้ถ้าจำเป็น
    const numValue = value === '' ? 0 : parseInt(value) || 0;

    const newStatus = {
      ...status,
      [field]: numValue,
    };

    // คำนวณ total อัตโนมัติ
    if (field.includes('male') || field.includes('female')) {
      if (field.startsWith('start_')) {
        newStatus.start_total = newStatus.start_male + newStatus.start_female;
      } else if (field.startsWith('end_')) {
        newStatus.end_total = newStatus.end_male + newStatus.end_female;
      } else if (field.startsWith('transfer_in_')) {
        newStatus.transfer_in_total =
          newStatus.transfer_in_male + newStatus.transfer_in_female;
      } else if (field.startsWith('transfer_out_')) {
        newStatus.transfer_out_total =
          newStatus.transfer_out_male + newStatus.transfer_out_female;
      }
    }

    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  return (
    <div className="space-y-4">
      {/* Students at start of year */}
      <div className="grid grid-cols-4 items-center gap-2">
        <div className="overflow-hidden text-ellipsis">
          <Label text="นักเรียนต้นปีการศึกษา" />
        </div>
        <FormRow
          label="ชาย"
          value={status.start_male}
          onChange={(v) => handleChange('start_male', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="หญิง"
          value={status.start_female}
          onChange={(v) => handleChange('start_female', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="รวม"
          value={status.start_total}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={true}
        />
      </div>

      {/* Students who left during year */}
      <div className="grid grid-cols-4 items-center gap-2">
        <div className="overflow-hidden text-ellipsis">
          <Label text="ออกระหว่างปีการศึกษา" />
        </div>
        <FormRow
          label="ชาย"
          value={status.transfer_out_male}
          onChange={(v) => handleChange('transfer_out_male', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="หญิง"
          value={status.transfer_out_female}
          onChange={(v) => handleChange('transfer_out_female', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="รวม"
          value={status.transfer_out_total}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={true}
        />
      </div>

      {/* Students who joined during year */}
      <div className="grid grid-cols-4 items-center gap-2">
        <div className="overflow-hidden text-ellipsis">
          <Label text="เข้าระหว่างปีการศึกษา" />
        </div>
        <FormRow
          label="ชาย"
          value={status.transfer_in_male}
          onChange={(v) => handleChange('transfer_in_male', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="หญิง"
          value={status.transfer_in_female}
          onChange={(v) => handleChange('transfer_in_female', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="รวม"
          value={status.transfer_in_total}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={true}
        />
      </div>

      {/* Students at end of year */}
      <div className="grid grid-cols-4 items-center gap-2">
        <div className="overflow-hidden text-ellipsis">
          <Label text="รวมสิ้นปีการศึกษา" />
        </div>
        <FormRow
          label="ชาย"
          value={status.end_male}
          onChange={(v) => handleChange('end_male', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="หญิง"
          value={status.end_female}
          onChange={(v) => handleChange('end_female', v)}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={editable}
        />
        <FormRow
          label="รวม"
          value={status.end_total}
          labelAfter="คน"
          classNameInput="w-12"
          className="justify-start"
          editable={true}
        />
      </div>
    </div>
  );
}
