import { GuardianInfo } from '@domain/g06/g06-d05/local/api/type';

function isParentInfoArray(data: any): data is GuardianInfo[] {
  return Array.isArray(data) && data.length > 0;
}
export function getParentInfo(ParentData: any[]): GuardianInfo[] {
  if (!ParentData || ParentData.length === 0) return [];
  if (isParentInfoArray(ParentData[0].data_json)) {
    return ParentData[0].data_json;
  }
  return [];
}
