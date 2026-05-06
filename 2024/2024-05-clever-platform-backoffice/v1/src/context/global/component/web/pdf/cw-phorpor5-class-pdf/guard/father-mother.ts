import { ParentInfo } from '@domain/g06/g06-d05/local/api/type';

function isFatherMotherInfoArray(data: any): data is ParentInfo[] {
  return Array.isArray(data) && data.length > 0;
}
export function getFatherMotherInfo(fatherMotherData: any[]): ParentInfo[] {
  if (!fatherMotherData || fatherMotherData.length === 0) return [];
  if (isFatherMotherInfoArray(fatherMotherData[0].data_json)) {
    return fatherMotherData[0].data_json;
  }
  return [];
}
