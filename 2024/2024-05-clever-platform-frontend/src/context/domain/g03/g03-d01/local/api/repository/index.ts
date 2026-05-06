import { DataAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '@domain/g03/g03-d01/g03-d01-p05-main-menu-leaderboard/types';
import {
  Achievement,
  DataAPIResponseNoCode,
  InventoryInfo,
  StreakLogin,
} from '../../type';

import { Character, CharacterResponse } from '../../../../g03-d04/local/types';

export interface AchievementRepository {
  Gets: (subjectId: string) => Promise<PaginationAPIResponse<any>>;
}

export interface MainMenuRepository {
  GetInventoryInfo: () => Promise<DataAPIResponseNoCode<InventoryInfo>>;
  GetCountCheckIn: (subjectId: string) => Promise<DataAPIResponseNoCode<StreakLogin>>;
  GetCountUnreadAnnouncement: () => Promise<DataAPIResponseNoCode<StreakLogin>>;
  GetAchievement: (subjectId: string) => Promise<DataAPIResponse<Achievement[]>>;
  GetLeaderBoard: (
    subjectId: string,
    tab: string,
    startDate: string,
    endDate: string,
  ) => Promise<DataAPIResponse<LeaderboardResponse>>;
}

export interface CharacterRepository {
  CharacterAll: {
    Get(): Promise<DataAPIResponse<CharacterResponse[]>>;
  };
  UpdateCharacter: {
    Patch(
      avatarId: number | undefined,
      isEquipped: boolean,
    ): Promise<DataAPIResponse<Character>>;
  };
}
