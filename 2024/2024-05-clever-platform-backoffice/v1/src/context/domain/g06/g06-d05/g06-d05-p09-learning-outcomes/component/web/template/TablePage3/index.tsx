import { useEffect, useState } from 'react';
import styles from './index.module.css';
import API from '@domain/g06/g06-d05/local/api';
import {
  EvaluationItem,
  Student,
  StudentWithScore,
  Subject,
  Score,
  DataJson,
} from '@domain/g06/g06-d05/g06-d05-p09-learning-outcomes/component/web/template/TablePage3/type';

type TablePage3Props = {
  evaluationFormId: number;
  id: number;
};

export default function TablePage3({ evaluationFormId, id }: TablePage3Props) {
  const [data, setData] = useState<EvaluationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankedStudents, setRankedStudents] = useState<StudentWithScore[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.GetDetailPhorpor5(evaluationFormId, id, {});

        if (
          response &&
          'data' in response &&
          Array.isArray(response.data) &&
          response.status_code === 200 &&
          response.data.length > 0
        ) {
          const raw = response.data[0];

          const resData: EvaluationItem = {
            ...raw,
            data_json: raw.data_json as unknown as DataJson,
            additional_data: raw.additional_data ? { nutrition: [] } : undefined,
          };

          const students = resData.data_json.student_list;
          const subjects = resData.data_json.subject;

          const studentsWithScore: StudentWithScore[] = students.map(
            (student: Student) => {
              const total = subjects.reduce((sum: number, subj: Subject) => {
                const scoreObj = subj.class_score.find(
                  (s: Score) => s.evaluation_student_id === student.id,
                );
                return sum + (scoreObj?.score ?? 0);
              }, 0);

              const maxTotalScore = subjects.reduce(
                (sum, subj) => sum + subj.max_score,
                0,
              );

              const percent = maxTotalScore > 0 ? (total / maxTotalScore) * 100 : 0;

              return { ...student, totalScore: total, percent, rank: 0 };
            },
          );

          const sorted = [...studentsWithScore].sort(
            (a, b) => b.totalScore - a.totalScore,
          );
          sorted.forEach((student, index) => {
            student.rank = index + 1;
          });

          setData(resData);
          setRankedStudents(studentsWithScore);
        } else {
          console.warn('ไม่พบข้อมูลหรือเกิดข้อผิดพลาด:', response?.message);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [evaluationFormId, id]);

  if (loading) return <p>Loading...</p>;
  if (!data?.data_json) return <p>ไม่พบข้อมูล</p>;

  const { school_name, academic_year, year, subject } = data.data_json;

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th colSpan={subject.length + 5} className="text-center text-sm">
              ผลการพัฒนาคุณภาพผู้เรียน ระดับชั้น {year} ปีการศึกษา {academic_year}
              <br />
              {school_name}
            </th>
          </tr>
          <tr>
            <th>เลขที่</th>
            <th>ชื่อสกุล</th>
            {subject.map((subj: Subject, idx: number) => (
              <th key={`head-${idx}`} className={styles['th-rotate']}>
                {subj.name}
              </th>
            ))}
            <th>รวม</th>
            <th>ร้อยละ</th>
            <th>ลำดับที่</th>
          </tr>
        </thead>
        <tbody>
          {rankedStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.no}</td>
              <td>{`${student.title}${student.first_name} ${student.last_name}`}</td>
              {subject.map((subj: Subject, idx: number) => {
                const scoreObj = subj.class_score.find(
                  (s: Score) => s.evaluation_student_id === student.id,
                );
                return <td key={`score-${student.id}-${idx}`}>{scoreObj?.score ?? 0}</td>;
              })}
              <td className="text-primary">{student.totalScore}</td>
              <td className="text-primary">{student.percent.toFixed(2)}</td>
              <td className="text-primary">{student.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
