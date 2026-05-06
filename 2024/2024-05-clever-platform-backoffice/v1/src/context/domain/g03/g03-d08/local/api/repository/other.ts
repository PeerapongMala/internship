import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { SchoolHeader } from '../type';

export interface OtherRepository {
  GetSchool(): Promise<DataAPIResponse<SchoolHeader>>;
}
