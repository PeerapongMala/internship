import { RepositoryPatternInterface } from '../../../repository-pattern';
import BuyToken from './buy-play-token';
import AccountInfoGet from './get-acccount-info';
import ArcadeInfoGet from './get-arcade-info';
import ArcadeLeaderBoardGet from './get-arcade-leaderboard';
import CheckSession from './get-check-session';

const Leaderboard: RepositoryPatternInterface['ArcadeLeaderBoardData'] = {
  ArcadeLeaderBoard: { Get: ArcadeLeaderBoardGet },
  ArcadeInfo: { Get: ArcadeInfoGet },
  AccountInfo: { Get: AccountInfoGet },
  CheckSession: { Get: CheckSession },
  BuyToken: { Get: BuyToken },
};

export default Leaderboard;
