import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { LessonLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const LevelLeaderBoardGet = (
  GameId: string,
): APITypeAPIResponse<LessonLeaderboardData | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => (MockJson as LessonLeaderboardData[]).find((obj) => obj.id === GameId),
    });
  });
};

export default LevelLeaderBoardGet;
