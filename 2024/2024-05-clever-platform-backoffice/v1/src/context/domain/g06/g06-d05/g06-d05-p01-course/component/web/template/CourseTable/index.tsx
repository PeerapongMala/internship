import {
  Course,
  IGetPhorpor5Detail,
  Subject,
  SubjectData,
} from '@domain/g06/g06-d05/local/api/type';
import styles from './index.module.css';
import CWInput from '@component/web/cw-input';

interface CourseTableProps {
  courseList: IGetPhorpor5Detail[];
  isEditable: boolean;
  onDataChange: (updatedData: IGetPhorpor5Detail[]) => void;
}
// million-ignore
export default function CourseTable({
  courseList,
  isEditable,
  onDataChange,
}: CourseTableProps) {
  const isSubjectData = (data: any): data is SubjectData => {
    return (
      data &&
      typeof data.academic_year === 'string' &&
      typeof data.year === 'string' &&
      Array.isArray(data.subjects)
    );
  };

  const firstItem = courseList[0]?.data_json;
  const {
    academic_year = '',
    year = '',
    subjects = [],
  } = isSubjectData(firstItem) ? firstItem : {};

  const handleChange = (index: number, field: keyof Subject, value: string) => {
    const updatedCourseList = [...courseList];
    const updatedData = { ...updatedCourseList[0].data_json } as SubjectData;

    updatedData.subjects = [...updatedData.subjects];
    updatedData.subjects[index] = {
      ...updatedData.subjects[index],
      [field]: value,
    };

    updatedCourseList[0] = {
      ...updatedCourseList[0],
      data_json: updatedData,
    };

    onDataChange(updatedCourseList);
  };

  return (
    <div className="w-full">
      <table className={`${styles.table} w-full bg-neutral-100`}>
        <thead>
          <tr>
            <th colSpan={6} className="font-bold">
              กรอกข้อมูลชั้นเรียน ภาคเรียน ปีการศึกษาและข้อมูลรายวิชา
            </th>
          </tr>
          <tr>
            <th>ชั้น</th>
            <th colSpan={5}>
              {isEditable ? (
                <CWInput
                  type="text"
                  value={year}
                  onChange={(e) => {
                    const updated = [...courseList];
                    const updatedData = { ...updated[0].data_json } as SubjectData;
                    updatedData.year = e.target.value;
                    updated[0].data_json = updatedData;
                    onDataChange(updated);
                  }}
                  className="flex w-full justify-center p-1"
                />
              ) : (
                year
              )}
            </th>
          </tr>
          <tr>
            <th>ปีการศึกษา</th>
            <th colSpan={5}>
              {isEditable ? (
                <CWInput
                  type="text"
                  value={academic_year}
                  onChange={(e) => {
                    const updated = [...courseList];
                    const updatedData = { ...updated[0].data_json } as SubjectData;
                    updatedData.academic_year = e.target.value;
                    updated[0].data_json = updatedData;
                    onDataChange(updated);
                  }}
                  className="flex w-full justify-center p-1"
                />
              ) : (
                academic_year
              )}
            </th>
          </tr>
          <tr>
            <th>ที่</th>
            <th>รหัสวิชา</th>
            <th>รายวิชา</th>
            <th>เวลาเรียน (ชั่วโมง/ปี)</th>
            <th>กลุ่มสาระการเรียนรู้</th>
            <th>ครูประจำวิชา</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject, index) => (
            <tr
              key={subject.id}
              className={
                index % 2 !== 0
                  ? 'bg-gray-50 hover:bg-neutral-100'
                  : 'bg-white hover:bg-neutral-100'
              }
            >
              <td>{index + 1}</td>
              <td>
                {isEditable ? (
                  <CWInput
                    type="text"
                    value={subject.code}
                    onChange={(e) => handleChange(index, 'code', e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  subject.code
                )}
              </td>
              <td>
                {isEditable ? (
                  <CWInput
                    type="text"
                    value={subject.subject_name || subject.name || ''}
                    onChange={(e) => handleChange(index, 'subject_name', e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  subject.subject_name || subject.name
                )}
              </td>
              <td>
                {isEditable ? (
                  <CWInput
                    type="text"
                    value={subject.hours}
                    onChange={(e) => handleChange(index, 'hours', e.target.value)}
                    className="w-full p-1"
                  />
                ) : (
                  subject.hours
                )}
              </td>
              <td>
                {isEditable ? (
                  <CWInput
                    type="text"
                    value={subject.learning_group}
                    onChange={(e) =>
                      handleChange(index, 'learning_group', e.target.value)
                    }
                    className="w-full p-1"
                  />
                ) : (
                  subject.learning_group
                )}
              </td>
              <td>
                {isEditable ? (
                  <CWInput
                    type="text"
                    value={
                      subject.teacher.join(', ') +
                      (subject.teacher_advisor ? `  ${subject.teacher_advisor}` : '')
                    }
                    onChange={(e) => {
                      const teachers = e.target.value.split(',').map((t) => t.trim());
                      const updatedCourseList = [...courseList];
                      const updatedData = {
                        ...updatedCourseList[0].data_json,
                      } as SubjectData;

                      updatedData.subjects = [...updatedData.subjects];
                      updatedData.subjects[index] = {
                        ...updatedData.subjects[index],
                        teacher: teachers,
                        teacher_advisor:
                          teachers.length > 1 ? teachers[teachers.length - 1] : null,
                      };

                      updatedCourseList[0] = {
                        ...updatedCourseList[0],
                        data_json: updatedData,
                      };

                      onDataChange(updatedCourseList);
                    }}
                    className="w-full p-1"
                  />
                ) : (
                  <>
                    {subject.teacher.join(', ')}
                    {subject.teacher_advisor && `  ${subject.teacher_advisor}`}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
