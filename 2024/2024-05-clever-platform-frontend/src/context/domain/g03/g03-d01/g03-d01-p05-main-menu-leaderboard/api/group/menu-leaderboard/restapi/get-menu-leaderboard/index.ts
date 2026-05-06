import { DataAPIResponse } from '@core/helper/api-type';
import {
  LeaderboardResponse,
  StateTab,
} from '@domain/g03/g03-d01/g03-d01-p05-main-menu-leaderboard/types';
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

const MenuLeaderBoardGet = (
  subjectId: string,
  tab: StateTab = StateTab.CountryTab,
  startDate: string,
  endDate: string,
): Promise<DataAPIResponse<LeaderboardResponse>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const filterType = getFilterType(tab);

  if (!subjectId) {
    throw new Error('Subject ID is required');
  }

  const url = `${backendURL}/level/v1/leaderboard/subject/${subjectId}?filterType=${filterType}&startDate=${startDate}&endDate=${endDate}`;

  return fetchWithAuth(url, {
    method: 'GET',
  }) as unknown as Promise<DataAPIResponse<LeaderboardResponse>>;
};

export default MenuLeaderBoardGet;
