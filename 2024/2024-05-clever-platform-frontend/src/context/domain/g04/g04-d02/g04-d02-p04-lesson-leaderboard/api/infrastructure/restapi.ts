import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '../../types';
import LessonLeaderBoardData from '../group/lesson-leaderboard/restapi';
import { RepositoryPatternInterface } from '../repository-pattern';

const RestAPI: RepositoryPatternInterface = {
  LessonLeaderBoardData,
  LeaderBoard: {
    // LessonInfo: {
    //   Get: function (): APITypeAPIResponse<LessonLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
    LessonLeaderBoard: {
      Get: function (): Promise<DataAPIResponse<LeaderboardResponse>> {
        throw new Error('Function not implemented.');
      },
    },
    // AccountInfo: {
    //   Get: function (): APITypeAPIResponse<LessonLeaderboardData[]> {
    //     throw new Error('Function not implemented.');
    //   },
    // },
  },
};

export default RestAPI;
