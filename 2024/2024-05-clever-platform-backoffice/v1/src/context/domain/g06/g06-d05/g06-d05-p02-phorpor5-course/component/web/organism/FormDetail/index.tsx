import { CoverPageData } from '@domain/g06/g06-d05/local/api/type';
import { FormDetailProps } from '../Header';
import { useEffect, useState } from 'react';
import FormRow from '@domain/g06/g06-d05/g06-d05-p03-phorpor5-class/component/web/molecule/FormRow';
import Stat from '@domain/g06/g06-d05/g06-d05-p03-phorpor5-class/component/web/molecule/Stat';
import { Subject } from '@domain/g06/g06-d05/local/api/type';

export default function FormDetail({
  selectedSubjectID,
  phorpor5Course,
  editable = false,
  onDataChange,
}: FormDetailProps) {
  const dataJson = phorpor5Course[0]?.data_json as CoverPageData | undefined;

  if (!phorpor5Course || !phorpor5Course[0]) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  // is_subject: true
  const realSubjects = dataJson?.subject?.filter((subject) => subject.is_subject) || [];

  // หาครูทั้งหมดจากรายวิชาจริง
  const allTeachers = [
    ...new Set(realSubjects.flatMap((subject) => subject.teacher) || []),
  ].filter((teacher) => teacher);

  // หาครูที่ปรึกษาจากรายวิชาจริง
  const advisor = realSubjects.find(
    (subject) =>
      subject.teacher_advisor !== null && subject.teacher_advisor !== undefined,
  )?.teacher_advisor;

  const [formData, setFormData] = useState(() => {
    if (!dataJson) {
      return {
        yearLevel: 'ไม่ระบุชั้นปี',
        academicYear: 'ไม่ระบุปีการศึกษา',
        advisor: 'ไม่ระบุครูที่ปรึกษา',
        subjectName: 'ไม่ระบุรายวิชา',
        subjectCode: 'ไม่ระบุรหัสวิชา',
        subjectHours: '0',
        learningGroup: 'ไม่ระบุสาระการเรียนรู้',
      };
    }

    const firstSubject = realSubjects[0];


    return {
      yearLevel: dataJson.year || 'ไม่ระบุชั้นปี',
      academicYear: dataJson.academic_year || 'ไม่ระบุปีการศึกษา',
      advisor: advisor || 'ไม่ระบุครูที่ปรึกษา',
      subjectName: firstSubject?.name || 'ไม่ระบุรายวิชา',
      subjectCode: firstSubject?.code || 'ไม่ระบุรหัสวิชา',
      subjectHours: firstSubject?.hours?.toString() || '0',
      learningGroup: firstSubject?.learning_group || 'ไม่ระบุสาระการเรียนรู้',
    };
  });

  const handleStatusChange = (status: CoverPageData['student_status']) => {
    if (!phorpor5Course[0]?.data_json) return;

    const updatedData = [...phorpor5Course];
    (updatedData[0].data_json as CoverPageData).student_status = status;
    onDataChange?.(updatedData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (!phorpor5Course[0]?.data_json || !selectedSubjectID) return;

    const updatedData = [...phorpor5Course];
    const course = updatedData[0];
    const coverData = course.data_json as CoverPageData;
    const subjects = [...coverData.subject];

    const targetSubject = subjects.find(s => s.id === selectedSubjectID && s.is_subject);
    if (!targetSubject) return;

    const newSubjects = subjects.map(s => {
      if (s.id === targetSubject.id) {
        switch (field) {
          case 'subjectName':
            return { ...s, name: value };
          case 'subjectCode':
            return { ...s, code: value };
          case 'subjectHours':
            return { ...s, hours: parseInt(value) || 0 };
          case 'learningGroup':
            return { ...s, learning_group: value };
          default:
            return s;
        }
      }
      return s;
    });

    course.data_json = {
      ...coverData,
      subject: newSubjects,
      ...(field === 'yearLevel' && { year: value }),
      ...(field === 'academicYear' && { academic_year: value }),
    };

    onDataChange?.(updatedData);
  };

  useEffect(() => {
    const subject = ((phorpor5Course[0].data_json as any).subject as Subject[]).find(
      (sj) => sj.id == selectedSubjectID,
    );

    if (!subject) return;

    setFormData((prev) => ({
      ...prev,
      subjectHours: subject.hours?.toString?.() ?? '',
      subjectCode: subject.code,
      subjectName: subject.name ?? '',
      learningGroup: subject.learning_group,
    }));
  }, [selectedSubjectID]);

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

      <div className="grid w-full grid-cols-3 gap-2">
        <FormRow
          label="รายวิชา"
          value={formData.subjectName}
          onChange={(v) => handleInputChange('subjectName', v)}
          classNameInput=""
          className="col-span-1"
          editable={editable}
        />
        <FormRow
          label="รหัสวิชา"
          value={formData.subjectCode}
          onChange={(v) => handleInputChange('subjectCode', v)}
          classNameInput="text-nowrap"
          className="col-span-1 text-nowrap"
          editable={editable}
        />
        <FormRow
          label="มาเรียน"
          labelAfter="ชั่วโมง/ปี"
          value={formData.subjectHours}
          onChange={(v) => handleInputChange('subjectHours', v)}
          classNameInput=""
          className="col-span-1 min-w-[200px] text-nowrap"
          editable={editable}
        />
      </div>

      <FormRow
        label="กลุ่มสาระการเรียนรู้"
        value={formData.learningGroup ?? 'ไม่ระบุกลุ่มสาระ'}
        onChange={(v) => {
          handleInputChange('learningGroup', v);
        }}
        classNameInput="flex-grow"
        editable={editable}
      />

      {/* ครูประจำวิชา (แสดงเฉพาะ teacher) */}
      <FormRow
        labelAfter="ครูประจำวิชา"
        value={allTeachers.join(' / ')}
        onChange={(v) => {
          const updatedData = [...phorpor5Course];
          const newTeachers = v.split('/').map((t) => t.trim());

          // อัพเดทเฉพาะ teacher โดยไม่แก้ไข teacher_advisor
          realSubjects.forEach((subject) => {
            subject.teacher = newTeachers;
            // เก็บ teacher_advisor เดิมไว้หากมี
            if (!subject.teacher_advisor && advisor) {
              subject.teacher_advisor = advisor;
            }
          });

          onDataChange?.(updatedData);
        }}
        classNameInput="flex-grow"
        editable={editable}
      />

      <FormRow
        labelAfter="ครูประจำชั้น/ครูที่ปรึกษา"
        value={
          advisor
            ? `${advisor}`
            : allTeachers.join(' / ')
        }
        onChange={(v) => {
          const updatedData = [...phorpor5Course];
          const parts = v.split('/').map((t) => t.trim());
          const newAdvisor = parts[0]; // ตัวแรกคือครูที่ปรึกษา
          const newTeachers = parts.slice(1); // ที่เหลือคือครูประจำวิชา

          // อัพเดททั้ง teacher และ teacher_advisor
          realSubjects.forEach((subject) => {
            if (newAdvisor) {
              subject.teacher_advisor = newAdvisor;
            }
            if (newTeachers.length > 0) {
              subject.teacher = newTeachers;
            }
          });

          onDataChange?.(updatedData);
        }}
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
