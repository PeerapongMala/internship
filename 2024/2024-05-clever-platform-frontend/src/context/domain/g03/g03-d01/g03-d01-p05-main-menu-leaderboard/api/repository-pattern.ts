import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse, StateTab } from '../types';

export interface RepositoryPatternInterface {
  [x: string]: any;
  Leaderboard: {
    // AccountInfo: {
    //   Get(): APITypeAPIResponse<DataAPIResponse<MenuLeaderboardData[]>>;
    // };
    // MenuInfo: {
    //   Get(): APITypeAPIResponse<DataAPIResponse<MenuLeaderboardData[]>>;
    // };
    MenuLeaderBoard: {
      Get(
        subjectId: string,
        tab?: StateTab,
        startDate?: string,
        endDate?: string,
      ): Promise<DataAPIResponse<LeaderboardResponse>>;
    };
  };
}
