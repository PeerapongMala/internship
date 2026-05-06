import { AchievementData, CoverPageData } from '@domain/g06/g06-d05/local/api/type';
import { FormDetailProps } from '../../Header';
import styles from './index.module.css';

// million-ignore
export default function LearnerCompetencies({ phorpor5Course }: FormDetailProps) {
  function isCoverPageData(data: any): data is CoverPageData {
    return 'school_name' in data && 'subject' in data && 'student_status' in data;
  }
  function isAchievementData(data: any): data is AchievementData {
    return 'school_name' in data && 'subject' in data;
  }
  const dataJson = phorpor5Course[0]?.data_json;

  if (!dataJson || (!isCoverPageData(dataJson) && !isAchievementData(dataJson))) {
    return <div>ไม่มีข้อมูลผลสัมฤทธิ์ทางการเรียนรู้</div>;
  }

  const subjects = dataJson.subject || [];

  const academicSubjects = subjects.filter((subject) => subject.is_subject);

  const nonAcademicScores = subjects.reduce(
    (acc, subject) => {
      if (!subject.is_subject) {
        if (subject.learning_group === 'คุณลักษณะอันพึงประสงค์') {
          acc.characteristics = subject.scores || {};
        } else if (subject.learning_group === 'สมรรถนะ') {
          acc.competencies = subject.scores || {};
        }
      }
      return acc;
    },
    {} as {
      characteristics?: Record<string, number>;
      competencies?: Record<string, number>;
    },
  );

  return (
    <>
      <h2 className="text-center font-bold">สรุปผลสัมฤทธิ์ทางการเรียนรู้</h2>

      {/* ตารางแสดงผลการเรียนรายวิชา */}
      <table
        className={`w-full ${styles['table']} table-fixed border-collapse border border-b-[1.5px] border-black`}
      >
        <thead className="text-center">
          <tr className={`${styles['p-reset']}`}>
            <th className="w-1/4">ระดับ</th>
            <th>มส</th>
            <th>ร</th>
            <th>0</th>
            <th>1</th>
            <th>1.5</th>
            <th>2</th>
            <th>2.5</th>
            <th>3</th>
            <th>3.5</th>
            <th>4</th>
          </tr>
        </thead>
        <tbody className={`border-black`}>
          {academicSubjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-fuchsia-100">
              <td className="border border-black p-2">จำนวนนักเรียน</td>
              <td className="border border-black p-2">{subject.scores?.['มส'] || '-'}</td>
              <td className="border border-black p-2">{subject.scores?.['ร'] || '-'}</td>
              <td className="border border-black p-2">{subject.scores?.['0'] || '-'}</td>
              <td className="border border-black p-2">{subject.scores?.['1'] || '-'}</td>
              <td className="border border-black p-2">
                {subject.scores?.['1.5'] || '-'}
              </td>
              <td className="border border-black p-2">{subject.scores?.['2'] || '-'}</td>
              <td className="border border-black p-2">
                {subject.scores?.['2.5'] || '-'}
              </td>
              <td className="border border-black p-2">{subject.scores?.['3'] || '-'}</td>
              <td className="border border-black p-2">
                {subject.scores?.['3.5'] || '-'}
              </td>
              <td className="border border-black p-2">{subject.scores?.['4'] || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ตารางสรุปคุณลักษณะอันพึงประสงค์ */}
      <table className={`w-full ${styles['table']} table-fixed`}>
        <thead>
          <tr>
            <th className="w-1/4" rowSpan={2}>
              สรุปการประเมิน
            </th>
            <th colSpan={4}>คุณลักษณะอันพึงประสงค์</th>
            <th colSpan={4}>อ่าน คิด วิเคราะห์ และ เขียน</th>
          </tr>
          <tr>
            <th>ไม่ผ่าน</th>
            <th>ผ่าน</th>
            <th>ดี</th>
            <th>ดีเยี่ยม</th>
            <th>ไม่ผ่าน</th>
            <th>ผ่าน</th>
            <th>ดี</th>
            <th>ดีเยี่ยม</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-fuchsia-100">
            <td className="w-1/4">จำนวนนักเรียน</td>
            {/* คุณลักษณะอันพึงประสงค์ */}
            <td>{nonAcademicScores.characteristics?.['มผ'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ผ'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ด'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ดย'] || '-'}</td>
            {/* อ่าน คิด วิเคราะห์ และ เขียน */}
            <td>{nonAcademicScores.characteristics?.['มผ2'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ผ2'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ด2'] || '-'}</td>
            <td>{nonAcademicScores.characteristics?.['ดย2'] || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* ตารางสรุปสมรรถนะสำคัญของผู้เรียน */}
      <table className={`w-full ${styles['table']} table-fixed`}>
        <thead>
          <tr>
            <th rowSpan={2} className="w-2/5">
              สรุปการประเมิน
            </th>
            <th colSpan={4} className="px-5">
              สมรรถนะสำคัญของผู้เรียน
            </th>
          </tr>
          <tr>
            <th>ไม่ผ่าน</th>
            <th>ผ่าน</th>
            <th>ดี</th>
            <th>ดีเยี่ยม</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-fuchsia-100">
            <td className="w-2/5">จำนวนนักเรียน</td>
            <td>{nonAcademicScores.competencies?.['มผ'] || '-'}</td>
            <td>{nonAcademicScores.competencies?.['ผ'] || '-'}</td>
            <td>{nonAcademicScores.competencies?.['ด'] || '-'}</td>
            <td>{nonAcademicScores.competencies?.['ดย'] || '-'}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
