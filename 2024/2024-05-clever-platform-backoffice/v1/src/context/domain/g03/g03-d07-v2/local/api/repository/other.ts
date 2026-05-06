import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { SchoolHeader } from '../types/shop';

export interface OtherRepository {
  GetSchool(): Promise<DataAPIResponse<SchoolHeader>>;
}
