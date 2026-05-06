import { APITypeAPIResponse } from '@core/helper/api-type';
import { IProfile } from '../type';

export interface RepositoryPatternInterface {
  User: {
    UserCurrent: { Get(): APITypeAPIResponse<IProfile> };
  };
}
