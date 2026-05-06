import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d01/local/api';
import { TSubject } from '@domain/g06/g06-d01/local/type/subject';
import showMessage from '@global/utils/showMessage';
import { Subjects } from '@domain/g06/g06-d01/local/api/type';
import { getUserData } from '@global/utils/store/getUserData';

interface SubjectsSettingProps {
  subjects: Subjects[];
  templateYear: string;
  disabledEdit?: boolean;
  onChange: (updatedSubjects: Subjects[]) => void;
}

const SubjectsSetting = ({
  subjects,
  templateYear,
  disabledEdit,
  onChange,
}: SubjectsSettingProps) => {
  const userData = getUserData();

  const [cleverSubjects, setCleverSubjects] = useState<TSubject[]>([]);

  useEffect(() => {
    fetchSubjectLists();
  }, [templateYear]);

  const fetchSubjectLists = async () => {
    try {
      const response = await API.AdminSchool.GetSubjectBySchoolID(userData.school_id, {
        limit: -1,
        year: templateYear,
      });
      setCleverSubjects(response.data.data);
    } catch (error) {
      showMessage('พบปัญหาในการเรียกค่ากับเซิร์ฟเวอร์', 'error');
    }
  };

  const handleFieldChange = <K extends keyof Subjects>(
    index: number,
    key: K,
    value: Subjects[K],
  ) => {
    const updated = [...subjects];
    updated[index][key] = value;
    onChange(updated);
  };

  const handleAddSubject = () => {
    onChange([
      ...subjects,
      {
        subject_name: '',
        is_clever: false,
        indicator: [],
        hours: null,
        learning_area: '',
        subject_no: '',
        credits: 0,
        is_extra: null,
      },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    const updated = subjects.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div>
      <h1 className="text-[24px] font-bold">ตั้งค่าการเชื่อมต่อคะแนนบทเรียน</h1>
      {subjects.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between pt-3">
            <h1 className="mt-3 text-[16px] font-bold">วิชาที่ {index + 1}</h1>
            <button
              hidden={disabledEdit}
              type="button"
              onClick={() => handleRemoveSubject(index)}
            >
              <IconTrash />
            </button>
          </div>

          <div className="flex gap-2.5 pt-3">
            <CWInput
              disabled={disabledEdit}
              label="ชื่อวิชา:"
              className="w-full"
              placeholder="วิชา..."
              value={item.subject_name}
              onChange={(e) => handleFieldChange(index, 'subject_name', e.target.value)}
              required
            />

            <CWSelect
              disabled={disabledEdit}
              options={[
                { label: 'ไม่เชื่อม', value: false },
                { label: 'เชื่อม', value: true },
              ]}
              label="เชื่อมต่อข้อมูลกับ Clever:"
              value={item.is_clever}
              required
              onChange={(e) => {
                const newVal = e.target.value;

                handleFieldChange(index, 'is_clever', newVal);
                if (!newVal) {
                  handleFieldChange(index, 'clever_subject_id', undefined);
                }
              }}
            />

            {item.is_clever ? (
              <CWSelect
                label="วิชา Clever:"
                required
                disabled={disabledEdit}
                value={item.clever_subject_id}
                options={cleverSubjects.map((subject) => ({
                  label: subject.subject_name,
                  value: subject.subject_id,
                }))}
                onChange={(e) =>
                  handleFieldChange(index, 'clever_subject_id', Number(e.target.value))
                }
              />
            ) : (
              <></>
            )}

            <CWSelect
              label="ประเภทวิชา"
              required
              disabled={disabledEdit}
              value={item.is_extra}
              options={[
                { label: 'วิชาพิ้นฐาน', value: false },
                { label: 'วิชาเพิ่มเติม', value: true },
              ]}
              placeholderValue={null}
              onChange={(e) => handleFieldChange(index, 'is_extra', e.target.value)}
            />
          </div>

          <div className="flex w-full gap-2.5 pt-3">
            <CWInput
              className="w-full"
              label="หน่วยกิต:"
              type="number"
              step={0.5}
              min={0}
              required
              disabled={disabledEdit}
              value={item.credits?.toFixed(1) ?? 0.0}
              onChange={(e) => {
                handleFieldChange(index, 'credits', Number(e.target.value));
              }}
            />

            <CWInput
              className="w-full"
              label="รหัสวิชา:"
              required
              disabled={disabledEdit}
              value={item.subject_no ?? ''}
              onChange={(e) => handleFieldChange(index, 'subject_no', e.target.value)}
            />

            <CWInput
              className="w-full"
              label="กลุ่มสาระการเรียนรู้:"
              required
              disabled={disabledEdit}
              value={item.learning_area ?? ''}
              onChange={(e) => handleFieldChange(index, 'learning_area', e.target.value)}
            />

            <CWInput
              className="w-full"
              type="number"
              min={0}
              label="เวลาเรียน (ชั่วโมง/ปี):"
              required
              disabled={disabledEdit}
              value={item.hours ?? 0}
              onChange={(e) => handleFieldChange(index, 'hours', Number(e.target.value))}
            />
          </div>
          <hr className="mt-3" />
        </div>
      ))}

      {!disabledEdit && (
        <div className="mt-3 flex justify-center text-center">
          <CWButton
            type="button"
            variant="primary"
            title="เพิ่มวิชา"
            outline
            onClick={handleAddSubject}
          />
        </div>
      )}
    </div>
  );
};

export default SubjectsSetting;
