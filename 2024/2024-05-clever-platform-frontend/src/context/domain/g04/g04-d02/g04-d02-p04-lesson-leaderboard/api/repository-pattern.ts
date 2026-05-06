import { DataAPIResponse } from '../../../../../../core/helper/api-type';
import { LeaderboardResponse } from '../types';

export interface RepositoryPatternInterface {
  [x: string]: any;
  LeaderBoard: {
    // LessonInfo: { Get(): APITypeAPIResponse<LessonLeaderboardData[]> };
    LessonLeaderBoard: { Get(): Promise<DataAPIResponse<LeaderboardResponse>> };
    // AccountInfo: { Get(): APITypeAPIResponse<LessonLeaderboardData[]> };
  };
}
