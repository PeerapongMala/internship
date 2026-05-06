import { APITypeAPIResponse, DataAPIResponse } from '@core/helper/api-type';
import {
  LeaderboardResponse,
  StateTab,
} from '@domain/g04/g04-d02/g04-d02-p05-level-leaderboard/types';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const getFilterType = (tab: StateTab): string => {
  switch (tab) {
    case StateTab.CountryTab:
      return 'all';
    case StateTab.AffiliationTab:
      return 'affiliation';
    case StateTab.YearTab:
      return 'school';
    case StateTab.ClassroomTab:
      return 'class';
    default:
      return 'all';
  }
};

const LevelLeaderBoardGet = (
  lessonId: string,
  tab: StateTab = StateTab.CountryTab,
  startDate: string,
  endDate: string,
): APITypeAPIResponse<DataAPIResponse<LeaderboardResponse>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const filterType = getFilterType(tab);

  if (!lessonId) {
    throw new Error('Lesson ID is required');
  }

  const url = `${backendURL}/level/v1/leaderboard/sub-lesson/${lessonId}?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}`;

  console.log('Fetching:', url);

  return fetchWithAuth(url, {
    method: 'GET',
  }) as unknown as APITypeAPIResponse<DataAPIResponse<LeaderboardResponse>>;
};

export default LevelLeaderBoardGet;
