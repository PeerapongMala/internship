import { DataAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse, MinigameList, UserDetail } from '../../types';
import ArcadeLeaderBoardData from '../group/arcade-leaderboard/restapi';
import { RepositoryPatternInterface } from '../repository-pattern';
import { IBuyTokenResponse, ISessionCheckResponse } from '../types';

const RestAPI: RepositoryPatternInterface = {
  ArcadeLeaderBoardData,
  LeaderBoard: {
    ArcadeInfo: {
      Get: function (): Promise<PaginationAPIResponse<MinigameList>> {
        throw new Error('Function not implemented.');
      },
    },
    ArcadeLeaderBoard: {
      Get: function (): Promise<PaginationAPIResponse<LeaderboardResponse>> {
        throw new Error('Function not implemented.');
      },
    },
    AccountInfo: {
      Get: function (): Promise<DataAPIResponse<UserDetail>> {
        throw new Error('Function not implemented.');
      },
    },
    CheckSession: {
      Get: function (req: {
        arcadeGameId: string;
      }): Promise<DataAPIResponse<ISessionCheckResponse>> {
        throw new Error('Function not implemented.');
      },
    },
    BuyToken: {
      Get: function (req: {
        arcadeGameId: string;
      }): Promise<DataAPIResponse<IBuyTokenResponse>> {
        throw new Error('Function not implemented.');
      },
    },
  },
};

export default RestAPI;
