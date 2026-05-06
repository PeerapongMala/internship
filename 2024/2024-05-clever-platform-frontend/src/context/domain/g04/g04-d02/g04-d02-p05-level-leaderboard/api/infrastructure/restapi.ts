import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '../../types';
import LevelLeaderBoardData from '../group/level-leaderboard/restapi';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
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

export default RestAPI;
