import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { School, SeedYear, User } from '../type';

export interface OtherRepository {
  User: {
    GetById(id: string): Promise<DataAPIResponse<User>>;
  };
  School: {
    GetById(id: string): Promise<DataAPIResponse<School>>;
  };
  SchoolAffiliation: {
    GetSeedYears(): Promise<DataAPIResponse<SeedYear[]>>;
  };
}
