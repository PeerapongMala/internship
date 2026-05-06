import { DataAPIResponse } from '@core/helper/api-type';
import {
  CheckinRequest,
  CheckinResponse,
  GoldCoinResponse,
  RewardList,
  UseItem,
  UserStat,
} from '../type';

export interface RepositoryPatternInterface {
  [x: string]: any;
  RewardList: {
    Reward: { Get(subjectId: string): Promise<DataAPIResponse<RewardList[]>> };
    UserStat: { Get(subjectId: string): Promise<DataAPIResponse<UserStat>> };
    Checkin: {
      Post(body: CheckinRequest): Promise<DataAPIResponse<CheckinResponse>>;
    };
    GoldCoin: { Get(): Promise<DataAPIResponse<GoldCoinResponse>> };
    UseItem: {
      Post(body: UseItem): Promise<DataAPIResponse<UseItem>>;
    };
  };
}
