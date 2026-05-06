import { APITypeAPIResponse } from '../../../../../../../../../../core/helper/api-type';
import { LessonLeaderboardData } from '../../../../../types';
import MockJson from './index.json';

const LessonInfoGet = (
  GameId: string,
): APITypeAPIResponse<LessonLeaderboardData | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () =>
        (MockJson as unknown as LessonLeaderboardData[]).find((obj) => obj.id === GameId),
    });
  });
};

export default LessonInfoGet;
