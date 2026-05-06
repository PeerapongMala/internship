import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountInfoGet from './get-account-info';
import MenuInfoGet from './get-menu-info';
import MenuLeaderBoardGet from './get-menu-leaderboard';

const Leaderboard: RepositoryPatternInterface['LeaderboardData'] = {
  AccountInfo: { Get: AccountInfoGet },
  MenuInfo: { Get: MenuInfoGet },
  MenuLeaderBoard: { Get: MenuLeaderBoardGet },
};

export default Leaderboard;
