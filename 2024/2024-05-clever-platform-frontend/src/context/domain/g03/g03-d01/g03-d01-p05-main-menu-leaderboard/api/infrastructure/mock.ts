import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '../../types';
import MenuLeaderBoard from '../group/menu-leaderboard/mock';
import { RepositoryPatternInterface } from '../repository-pattern';

const Mock: RepositoryPatternInterface = {
  MenuLeaderBoard,
  Leaderboard: {
    // AccountInfo: {
    //   Get: function (): APITypeAPIResponse<MenuLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
    // MenuInfo: {
    //   Get: function (): APITypeAPIResponse<MenuLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
    MenuLeaderBoard: {
      Get: function (): Promise<DataAPIResponse<LeaderboardResponse>> {
        throw new Error('Function not implemented.');
      },
    },
  },
};

export default Mock;
