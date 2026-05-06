import { EvaluationStudent } from '@domain/g06/g06-d05/g06-d05-p08-nutritional-summary/type';
import { IJsonStudentScoreDaum } from '@domain/g06/g06-d05/g06-d05-p10-desired-attributes/type';
import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';

export function getDesiredAttributeInfo(data: IGetPhorpor5Detail[]): {
  students: EvaluationStudent[];
  title: string;
  year: string;
  academicYear: string;
} {
  const target = data.find((item) => item.name === 'คุณลักษณะอันพึงประสงค์');

  const isValidDataJSON = (data: any): data is EvaluationStudent[] =>
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item.evaluation_student_id === 'number' &&
        Array.isArray(item.student_indicator_data),
    );

  if (target && isValidDataJSON(target.data_json)) {
    const title = `สรุปผลการประเมินคุณลักษณะอันพึงประสงค์`;
    return {
      students: target.data_json,
      title,
      year: target.year,
      academicYear: target.academic_year,
    };
  }

  return {
    students: [],
    title: 'ข้อมูลไม่พร้อมใช้งาน',
    year: '',
    academicYear: '',
  };
}
