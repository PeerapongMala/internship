import { DataAPIResponse } from '@global/utils/apiResponseHelper';

import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';

export interface SchoolRepository {
  // g03-d04-a00
  GetSchoolId(): Promise<DataAPIResponse<SchoolResponse>>;
}
