import { RepositoryPatternInterface } from '../../../repository-pattern';
import AccountInfoGet from './get-acccount-info';
import MenuInfoGet from './get-menu-info';
import MenuLeaderBoardGet from './get-menu-leaderboard';

const Leaderboard: RepositoryPatternInterface['LeaderboardData'] = {
  MenuLeaderBoard: { Get: MenuLeaderBoardGet },
  MenuInfo: { Get: MenuInfoGet },
  AccountInfo: { Get: AccountInfoGet },
};

export default Leaderboard;
