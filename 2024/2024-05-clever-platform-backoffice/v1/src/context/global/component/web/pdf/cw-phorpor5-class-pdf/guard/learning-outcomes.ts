import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';
import {
  SubjectData,
  AcademicInfo,
  DataJSON,
} from '@domain/g06/g06-d05/g06-d05-p09-learning-outcomes/component/web/template/TablePage1/type';

export function getLearningOutcomeInfo(data: IGetPhorpor5Detail[]): {
  subjects: SubjectData[];
  academicInfo: AcademicInfo | null;
} {
  const target = data.find((item) => item.name === 'ผลสัมฤทธิ์ทางการเรียน');

  const isValidDataJSON = (data: any): data is DataJSON =>
    data &&
    typeof data.school_name === 'string' &&
    typeof data.academic_year === 'string' &&
    typeof data.year === 'string' &&
    typeof data.male_count === 'number' &&
    typeof data.female_count === 'number' &&
    typeof data.total_count === 'number' &&
    Array.isArray(data.subject) &&
    data.subject.every(
      (subj: any) =>
        typeof subj.id === 'number' &&
        typeof subj.name === 'string' &&
        typeof subj.scores === 'object' &&
        subj.scores !== null,
    );

  if (target && isValidDataJSON(target.data_json)) {
    const { subject, ...academicInfo } = target.data_json;
    return {
      subjects: subject,
      academicInfo,
    };
  }

  return { subjects: [], academicInfo: null };
}
