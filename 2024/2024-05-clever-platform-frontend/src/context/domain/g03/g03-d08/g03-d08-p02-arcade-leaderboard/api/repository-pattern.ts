import {
  DataAPIResponse,
  PaginationAPIResponse,
} from '../../../../../../core/helper/api-type';
import {
  DateType,
  LeaderboardResponse,
  MinigameList,
  StateTab,
  UserDetail,
} from '../types';
import { IBuyTokenResponse, ISessionCheckResponse } from './types';

export interface RepositoryPatternInterface {
  [x: string]: any;
  LeaderBoard: {
    ArcadeInfo: { Get(): Promise<PaginationAPIResponse<MinigameList>> };
    ArcadeLeaderBoard: {
      Get: (
        arcadeGameId: string,
        tab?: StateTab,
        dateType?: DateType,
      ) => Promise<PaginationAPIResponse<LeaderboardResponse>>;
    };
    AccountInfo: { Get(): Promise<DataAPIResponse<UserDetail>> };
    CheckSession: {
      Get: (req: {
        arcadeGameId: string;
      }) => Promise<DataAPIResponse<ISessionCheckResponse>>;
    };
    BuyToken: {
      Get: (req: { arcadeGameId: string }) => Promise<DataAPIResponse<IBuyTokenResponse>>;
    };
  };
}
