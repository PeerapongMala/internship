import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '../../types';
import LevelLeaderBoardData from '../group/level-leaderboard/mock';
import { RepositoryPatternInterface } from '../repository-pattern';

const Mock: RepositoryPatternInterface = {
  LevelLeaderBoardData,
  LeaderBoard: {
    // LevelInfo: {
    //   Get: function (): APITypeAPIResponse<LevelLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
    LevelLeaderBoard: {
      Get: function (): Promise<DataAPIResponse<LeaderboardResponse>> {
        throw new Error('Function not implemented.');
      },
    },
    // AccountInfo: {
    //   Get: function (): APITypeAPIResponse<LevelLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
  },
};

export default Mock;
