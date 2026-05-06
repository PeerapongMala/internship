import { RepositoryPatternInterface } from '../../../repository-pattern';
import CheckInPost from './check-in-post';
import GoldCoinGet from './coin-arcade-get';
import RewardListGet from './reward-list-get';
import UseItemPost from './use-item-post';
import UserStatGet from './user-stat-get';

const Reward: RepositoryPatternInterface['RewardList'] = {
  Reward: { Get: RewardListGet },
  UserStat: { Get: UserStatGet },
  Checkin: { Post: CheckInPost },
  GoldCoin: { Get: GoldCoinGet },
  UseItem: { Post: UseItemPost },
};

export default Reward;
