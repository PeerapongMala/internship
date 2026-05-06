import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import API from '@domain/g06/g06-d05/local/api';
import type {
  ApiResponseDataJson,
  GradeScore,
  Student,
} from '@domain/g06/g06-d05/g06-d05-p09-learning-outcomes/component/web/template/TablePage2/type';

type TablePage2Props = {
  evaluationFormId: number;
  id: number;
};

export default function TablePage2({ evaluationFormId, id }: TablePage2Props) {
  const [data, setData] = useState<ApiResponseDataJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.GetDetailPhorpor5(evaluationFormId, id, {});
        if (res?.status_code === 200) {
          const firstData =
            res.data.length > 0 ? (res.data[0].data_json as ApiResponseDataJson) : null;
          setData(firstData);
        } else {
          console.error('API error:', res?.message ?? 'Unknown error');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [evaluationFormId, id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  const subjectsGroup = data.subject.slice(0, 13);

  const scoresByStudent: Record<number, Record<number, number>> = {};
  data.subject.forEach((subj) => {
    if (!subj.grade_score) return;
    subj.grade_score.forEach(({ evaluation_student_id, grade }: GradeScore) => {
      if (!scoresByStudent[evaluation_student_id]) {
        scoresByStudent[evaluation_student_id] = {};
      }
      scoresByStudent[evaluation_student_id][subj.id] = grade;
    });
  });

  const studentMap = new Map<number, Student>();
  data.student_list.forEach((student) => {
    studentMap.set(student.id, student);
  });

  return (
    <div className="overflow-x-auto">
      <table className={`${styles.table} w-full table-auto border-collapse text-sm`}>
        <thead>
          <tr>
            <th
              colSpan={5 + subjectsGroup.length + 2}
              className="!border-r-transparent text-center text-sm"
            >
              <p>
                ผลการพัฒนาคุณภาพผู้เรียน ระดับชั้น{data.year} ปีการศึกษา{' '}
                {data.academic_year}
              </p>
              <p>{data.school_name}</p>
            </th>
          </tr>

          <tr>
            <th className={styles['fix-width-no']} rowSpan={2}>
              เลขที่
            </th>
            <th
              className="min-w-[160px] whitespace-nowrap px-2 py-1 text-left"
              rowSpan={2}
              colSpan={4}
            >
              ชื่อสกุล
            </th>

            <th colSpan={subjectsGroup.length} className="whitespace-nowrap">
              คะแนนผลการเรียน
            </th>

            <th className={`${styles['fix-width']} whitespace-nowrap`} rowSpan={2}>
              ผลการเรียนเฉลี่ย
            </th>
            <th className={`${styles['fix-width']} whitespace-nowrap`} rowSpan={2}>
              ลำดับที่คะแนนรวม
            </th>
          </tr>

          <tr>
            {subjectsGroup.map((subj) => (
              <th key={subj.id} className={styles['th-rotate']}>
                {subj.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.grade_overview.map((g) => {
            const student = studentMap.get(g.evaluation_student_id);
            if (!student) return null;

            return (
              <tr key={g.evaluation_student_id}>
                <td className="text-center">{student.no}</td>
                <td
                  className="min-w-[160px] whitespace-nowrap px-2 py-1 !text-left"
                  colSpan={4}
                >
                  {`${student.title}${student.first_name} ${student.last_name}`}
                </td>

                {subjectsGroup.map((subj) => (
                  <td key={subj.id} className="text-center">
                    {scoresByStudent[g.evaluation_student_id]?.[subj.id] ?? 0}
                  </td>
                ))}

                <td className="text-center font-medium text-blue-600">
                  {g.average_grade}
                </td>
                <td className="text-center font-medium text-blue-600">{g.rank}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
