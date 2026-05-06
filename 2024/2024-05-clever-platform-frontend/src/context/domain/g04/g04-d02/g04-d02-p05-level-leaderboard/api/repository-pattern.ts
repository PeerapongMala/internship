import { DataAPIResponse } from '../../../../../../core/helper/api-type';
import { LeaderboardResponse } from '../types';

export interface RepositoryPatternInterface {
  [x: string]: any;
  LeaderBoard: {
    // LevelInfo: { Get(): APITypeAPIResponse<LevelLeaderboardData[]> };
    LevelLeaderBoard: { Get(): Promise<DataAPIResponse<LeaderboardResponse>> };
    // AccountInfo: { Get(): APITypeAPIResponse<LevelLeaderboardData[]> };
  };
}
