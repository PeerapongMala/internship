import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import { TeacherNoteResponse } from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import {
  ParamsTeacherStudent,
  UpdateCommentRequest,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import showMessage from '@global/utils/showMessage';
import { useParams, useRouter } from '@tanstack/react-router';
import React, { useState } from 'react';

const EditNote = ({
  setIsEditNotePage,
  userId,
  noteUpdateData,
  onSuccess,
}: {
  setIsEditNotePage: (value: boolean) => void;
  userId: string;
  noteUpdateData: TeacherNoteResponse | undefined;
  onSuccess: () => void;
}) => {
  const {
    state: {
      location: { pathname },
    },
  } = useRouter();
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });

  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});

  const handleSubmit = async () => {
    if (filters.text && noteUpdateData?.comment_id) {
      try {
        const body: UpdateCommentRequest = {
          text: filters.text,
        };
        const res = await API_g03.teacherStudent.UpdateComment(
          noteUpdateData?.comment_id,
          body,
        );

        if (res.status_code === 200) {
          onSuccess();
          setIsEditNotePage(false);
          showMessage('แก้ไขบันทึกครูสำเร็จ', 'success');
        } else {
          console.error('Failed to create new comment:', res);
        }
      } catch (error) {
        console.error('Error while creating comment:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-5">
        <div className="cursor-pointer p-2" onClick={() => setIsEditNotePage(false)}>
          <IconArrowBackward />
        </div>
        <span className="text-xl font-bold">แก้ไขโน๊ต</span>
      </div>

      <div className="flex items-start gap-5">
        <div className="panel flex-[3]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                label: 'ปีการศึกษา',
                title: noteUpdateData?.academic_year,
              },
              {
                label: 'ชั้นปี',
                title: noteUpdateData?.year,
              },
              {
                label: 'วิชา',
                title: noteUpdateData?.subject,
              },
              {
                label: 'บทที่:',
                title: noteUpdateData?.lesson_index,
              },
              {
                label: 'บทเรียนย่อยที่:',
                title: noteUpdateData?.sub_lesson_index,
              },
              {
                label: 'ด่านที่:',
                title: noteUpdateData?.level_index,
              },
            ].map(({ label, title }) => (
              <CWSelect
                key={label}
                label={label}
                required
                title={title}
                className="flex-1"
                disabled={true}
              />
            ))}
          </div>

          <div className="mt-5">
            <span className="text-red-500">*</span> โน๊ต:
            <textarea
              className="form-textarea mt-1.5 w-full rounded-md border border-gray-300 p-2"
              placeholder="กรอกข้อความที่นี่"
              value={noteUpdateData?.text}
              onChange={(e) => setFilters({ ...filters, text: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="panel flex-1 sm:max-w-lg">
          <div className="gap-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label>แก้ไขล่าสุด:</label>
              <p>-</p>
              <label>แก้ไขล่าสุดโดย:</label>
              <p>-</p>
            </div>
            <CWButton
              title="บันทึก"
              onClick={handleSubmit}
              className="mt-4 w-full"
              disabled={!filters.text}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNote;
