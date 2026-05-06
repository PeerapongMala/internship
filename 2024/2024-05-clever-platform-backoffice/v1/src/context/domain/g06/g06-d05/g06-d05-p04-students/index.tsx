import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { IGetPhorpor5Detail, StudentInfo } from '../local/api/type';
import API from '../local/api';
import { useParams } from '@tanstack/react-router';
import { formatToDate } from '@global/utils/format/date';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: TEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);

  const [studentList, setStudentList] = useState<IGetPhorpor5Detail[]>([]);
  const { evaluationFormId, path } = useParams({ strict: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});
      if (res?.status_code === 200) {
        setStudentList(res.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentData = (): StudentInfo[] | undefined => {
    if (!studentList[0]?.data_json) return undefined;

    try {
      const data = studentList[0].data_json;
      if (Array.isArray(data)) {
        return data.filter(
          (item): item is StudentInfo =>
            item &&
            'citizen_no' in item &&
            'birth_date' in item &&
            typeof item.no === 'number' &&
            typeof item.student_id === 'string' &&
            typeof item.first_name === 'string' &&
            typeof item.last_name === 'string' &&
            typeof item.citizen_no === 'string' &&
            typeof item.birth_date === 'string',
        );
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  const studentData = getStudentData();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <CWWhiteBox>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  colSpan={5}
                >{`${evaluationForm?.year} ปีการศึกษา ${evaluationForm?.academic_year}`}</th>
              </tr>
              <tr>
                <th>เลขที่</th>
                <th>รหัสนักเรียน</th>
                <th>ชื่อ-สกุล</th>
                <th>เลขประจำตัวประชาชน</th>
                <th>วันเกิด</th>
              </tr>
            </thead>
            <tbody>
              {studentData && studentData.length > 0 ? (
                studentData.map((student, index) => (
                  <tr key={`${student.student_id}-${index}`}>
                    <td>{student.no}</td>
                    <td>{student.student_id}</td>
                    <td>{`${student.title}${student.first_name} ${student.last_name}`}</td>
                    <td>{student.citizen_no}</td>
                    <td>
                      {formatToDate(student.birth_date, {
                        locale: 'th',
                        format: 'DD MMMM BBBB',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CWWhiteBox>
  );
};

export default DomainJSX;
