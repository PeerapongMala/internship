import { CoverPageData, IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import FormRow from '../../molecule/FormRow';
import Stat from '../../molecule/Stat';
import { useState } from 'react';

export interface FormDetailProps {
  phorpor5Course: IGetPhorpor5Detail[];
  editable?: boolean;
  onDataChange?: (data: IGetPhorpor5Detail[]) => void;
}

export default function FormDetail({
  phorpor5Course,
  editable = false,
  onDataChange,
}: FormDetailProps) {
  const dataJson = phorpor5Course[0]?.data_json as CoverPageData | undefined;

  if (!phorpor5Course || !phorpor5Course[0]) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  const [formData, setFormData] = useState(() => {
    if (!dataJson) {
      return {
        yearLevel: 'ไม่ระบุชั้นปี',
        academicYear: 'ไม่ระบุปีการศึกษา',
        advisor: 'ไม่ระบุครูที่ปรึกษา',
      };
    }
    return {
      yearLevel: dataJson.year || 'ไม่ระบุชั้นปี',
      academicYear: dataJson.academic_year || 'ไม่ระบุปีการศึกษา',
      advisor:
        dataJson.subject?.find(
          (s) => s.teacher_advisor !== null && s.teacher_advisor !== undefined,
        )?.teacher_advisor || 'ไม่ระบุครูที่ปรึกษา',
    };
  });

  const handleStatusChange = (status: CoverPageData['student_status']) => {
    if (!phorpor5Course[0]?.data_json) return;

    const updatedData = [...phorpor5Course];
    (updatedData[0].data_json as CoverPageData).student_status = status;
    onDataChange?.(updatedData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (dataJson) {
      const updatedData = [...phorpor5Course];
      const coverData = updatedData[0].data_json as CoverPageData;

      if (field === 'yearLevel') {
        coverData.year = value;
      } else if (field === 'academicYear') {
        coverData.academic_year = value;
      }

      onDataChange?.(updatedData);
    }
  };

  return (
    <div className="mb-5 items-center space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <FormRow
          label="ชั้นปี"
          value={formData.yearLevel}
          onChange={(v) => handleInputChange('yearLevel', v)}
          classNameInput=""
          editable={editable}
        />
        <FormRow
          label="ปีการศึกษา"
          value={formData.academicYear}
          onChange={(v) => handleInputChange('academicYear', v)}
          classNameInput=""
          className="text-nowrap"
          editable={editable}
        />
      </div>

      <FormRow
        labelAfter="ครูประจำชั้น/ครูที่ปรึกษา"
        value={formData.advisor}
        onChange={(v) => handleInputChange('advisor', v)}
        classNameInput="flex-grow"
        editable={editable}
      />

      <Stat
        data={phorpor5Course}
        editable={editable}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
