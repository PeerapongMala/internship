import { School } from './../../type';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';

export interface SchoolRepository {
  GetById(schoolId: number): Promise<DataAPIResponse<School>>;
}
