import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '../../types';
import MenuLeaderBoard from '../group/menu-leaderboard/restapi';
import AccountInfoGet from '../group/menu-leaderboard/restapi/get-acccount-info';
import MenuInfoGet from '../group/menu-leaderboard/restapi/get-menu-info';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
  MenuLeaderBoard,
  MenuInfoGet,
  AccountInfoGet,
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

export default RestAPI;
