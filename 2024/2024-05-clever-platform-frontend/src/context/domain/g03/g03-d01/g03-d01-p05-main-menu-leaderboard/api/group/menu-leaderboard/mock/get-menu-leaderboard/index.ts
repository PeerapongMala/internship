import { APITypeAPIResponse } from '@core/helper/api-type';

import { MenuLeaderboardData } from '@domain/g03/g03-d01/g03-d01-p05-main-menu-leaderboard/types';
import MockJson from './index.json';

const MenuLeaderBoardGet = (
  GameId: string,
): APITypeAPIResponse<MenuLeaderboardData | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as MenuLeaderboardData[]).find((obj) => obj.id === GameId),
    });
  });
};

export default MenuLeaderBoardGet;
