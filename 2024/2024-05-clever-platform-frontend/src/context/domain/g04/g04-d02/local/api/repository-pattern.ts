import { APITypeAPIResponse, DataAPIResponse } from '@core/helper/api-type';
import { LevelList } from '../../g04-d02-p01-level/type';
import { Homework } from '../type';

export interface RepositoryPatternInterface {
  LevelList: {
    Level: {
      Get(subjectId: string): Promise<APITypeAPIResponse<LevelList[]>>;
    };
  };
  Level: {
    GetHomeworkBySubjectId(subjectId: string): Promise<DataAPIResponse<Homework[]>>;
  };
}
