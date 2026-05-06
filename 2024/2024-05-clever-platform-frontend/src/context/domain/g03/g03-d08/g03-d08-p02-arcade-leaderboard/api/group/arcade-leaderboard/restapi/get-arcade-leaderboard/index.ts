import { PaginationAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { DateType, LeaderboardResponse, StateTab } from '../../../../../types';

export enum DisplayMode {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}

interface LeaderboardParams {
  arcadeGameId: string;
  tab: StateTab;
  dateType?: DateType;
  displayMode: DisplayMode;
  eventId?: number;
}

const ArcadeLeaderBoardGet = async ({
  arcadeGameId,
  tab = StateTab.ClassroomTab,
  displayMode = DisplayMode.Weekly,
  eventId,
}: LeaderboardParams): Promise<PaginationAPIResponse<LeaderboardResponse>> => {
  if (!arcadeGameId) {
    throw new Error('Arcade Game ID is required');
  }

  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const buildBaseUrl = (tab: StateTab) => {
    let url = `${backendURL}/arcade-game/v1/arcade-game/arcade-leaderboard/${arcadeGameId}`;

    if (tab !== StateTab.ClassroomTab) {
      const typeValue = (() => {
        switch (tab) {
          case StateTab.YearTab:
            return 'year';
          case StateTab.AffiliationTab:
            return 'affiliation';
          case StateTab.CountryTab:
            return 'all';
          default:
            return 'classroom';
        }
      })();
      url += `?type=${typeValue}`;
    }

    return url;
  };

  // สำหรับโหมด Event
  if (displayMode === DisplayMode.Event) {
    try {
      const baseUrl = buildBaseUrl(tab);
      const eventUrl =
        eventId !== undefined
          ? `${baseUrl}${tab === StateTab.ClassroomTab ? '?' : '&'}date=event&event_id=${eventId}`
          : baseUrl;

      const response = await fetchWithAuth(eventUrl, { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error in Event mode:', error);
      return ArcadeLeaderBoardGet({
        arcadeGameId,
        tab,
        displayMode: DisplayMode.Weekly,
      });
    }
  }

  // สำหรับโหมด Weekly/Monthly
  try {
    let url = buildBaseUrl(tab);
    url += displayMode === DisplayMode.Weekly ? '?date=week' : '?date=month';

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${displayMode} data:`, error);
    throw error;
  }
};

export default ArcadeLeaderBoardGet;
