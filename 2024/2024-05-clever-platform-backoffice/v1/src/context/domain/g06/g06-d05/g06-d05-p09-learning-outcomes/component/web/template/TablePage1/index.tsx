import { useEffect, useState } from 'react';
import styles from './index.module.css';
import API from '@domain/g06/g06-d05/local/api';
import type {
  SubjectData,
  AcademicInfo,
  DataJSON,
} from '@domain/g06/g06-d05/g06-d05-p09-learning-outcomes/component/web/template/TablePage1/type';

const SCORE_LEVELS = ['มส', 'ร', '0', '1', '1.5', '2', '2.5', '3', '3.5', '4'];

type TablePage1Props = {
  evaluationFormId: number;
  id: number;
};

export default function TablePage1({ evaluationFormId, id }: TablePage1Props) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.GetDetailPhorpor5(evaluationFormId, id, {});
        if (response && 'data' in response && Array.isArray(response.data)) {
          const data = response.data[0]?.data_json as unknown as DataJSON;
          if (data?.subject) {
            setSubjects(data.subject);
            setAcademicInfo({
              school_name: data.school_name,
              academic_year: data.academic_year,
              year: data.year,
              male_count: data.male_count,
              female_count: data.female_count,
              total_count: data.total_count,
            });
          }
        }
      } catch (error) {
        console.error('Error loading data', error);
      }
    };

    fetchData();
  }, [evaluationFormId, id]);

  return (
    <div className="overflow-x-auto">
      <table className={`${styles.table} w-full table-fixed border border-gray-300`}>
        <thead>
          <tr>
            <th className="w-40 min-w-40 !border-r-transparent"></th>
            <th colSpan={23} className="px-4 py-2">
              <p className="text-center text-sm font-medium">
                สรุปผลการประเมินผลสัมฤทธิ์ทางการเรียน
              </p>
              <p className="text-center text-sm">
                ชั้น{academicInfo?.year ?? ''} ปีการศึกษา{' '}
                {academicInfo?.academic_year ?? ''}
              </p>
              <p className="text-center text-sm">
                {academicInfo?.school_name ?? ''}{' '}
                สำนักงานเขตพื้นที่การศึกษาประถมศึกษานนทบุรี เขต 1
              </p>
            </th>
          </tr>
          <tr>
            <th className="px-3 py-2 text-left" rowSpan={3}>
              รายวิชา
            </th>
            <th colSpan={3} rowSpan={2}>
              จำนวนนักเรียน<br></br>
              เข้าสอบ
            </th>
            <th colSpan={20}>ระดับผลการเรียน</th>
          </tr>
          <tr>
            {SCORE_LEVELS.map((level) => (
              <th colSpan={2} key={level}>
                {level}
              </th>
            ))}
          </tr>
          <tr>
            <th>ชาย</th>
            <th>หญิง</th>
            <th>รวม</th>
            {SCORE_LEVELS.flatMap((level) => [
              <th key={`${level}-count`}>จำนวน</th>,
              <th key={`${level}-percent`}>%</th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => {
            const scores = subject.scores || {};
            const total = Object.values(scores).reduce((sum, val) => sum + val, 0);

            return (
              <tr key={subject.id}>
                <td className="w-40 min-w-40 !text-left text-xs">{subject.name}</td>
                <td className="px-2 py-1 text-xs">{academicInfo?.male_count ?? '-'}</td>
                <td className="px-2 py-1 text-xs">{academicInfo?.female_count ?? '-'}</td>
                <td className="px-2 py-1 text-xs">{academicInfo?.total_count ?? '-'}</td>
                {SCORE_LEVELS.flatMap((level) => {
                  const count = scores[level] ?? 0;
                  const percent = total > 0 ? ((count / total) * 100).toFixed(1) : '-';
                  return [
                    <td
                      key={`${subject.id}-${level}-count`}
                      className="px-2 py-1 text-xs"
                    >
                      {count}
                    </td>,
                    <td
                      key={`${subject.id}-${level}-percent`}
                      className="px-2 py-1 text-xs"
                    >
                      {percent}
                    </td>,
                  ];
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
