import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { LevelLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const LevelLeaderBoardGet = (
  GameId: string,
): APITypeAPIResponse<LevelLeaderboardData | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as LevelLeaderboardData[]).find((obj) => obj.id === GameId),
    });
  });
};

export default LevelLeaderBoardGet;
