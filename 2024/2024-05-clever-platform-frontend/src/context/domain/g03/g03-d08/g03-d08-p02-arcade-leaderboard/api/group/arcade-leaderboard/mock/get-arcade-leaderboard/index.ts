import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { ArcadeLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const ArcadeLeaderBoardGet = (
  GameId: string,
): APITypeAPIResponse<ArcadeLeaderboardData | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as ArcadeLeaderboardData[]).find((obj) => obj.id === GameId),
    });
  });
};

export default ArcadeLeaderBoardGet;
