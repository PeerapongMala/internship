import { StudentInfo } from '@domain/g06/g06-d05/local/api/type';

function isStudentInfoArray(data: any): data is StudentInfo[] {
  return Array.isArray(data) && data.length > 0 && 'citizen_no' in data[0];
}
export function getStudentInfo(studentData: any[]): StudentInfo[] {
  if (!studentData || studentData.length === 0) return [];
  if (isStudentInfoArray(studentData[0].data_json)) {
    return studentData[0].data_json;
  }
  return [];
}
