import { DataAPIResponse } from '@core/helper/api-type';
import { LeaderboardResponse } from '@domain/g03/g03-d01/g03-d01-p05-main-menu-leaderboard/types';
import {
  Achievement,
  DataAPIResponseNoCode,
  InventoryInfo,
  StreakLogin,
} from '@domain/g03/g03-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobalPersist from '@store/global/persist';
import { MainMenuRepository } from '../../../repository';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPIMainMenu: MainMenuRepository = {
  GetInventoryInfo: async function (): Promise<DataAPIResponseNoCode<InventoryInfo>> {
    const url = `${BACKEND_URL}/information/v1/inventory-information`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetCountCheckIn: async function (
    subjectId: string,
  ): Promise<DataAPIResponseNoCode<StreakLogin>> {
    const url = `${BACKEND_URL}/information/v1/count-checkin/${subjectId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetCountUnreadAnnouncement: async function (): Promise<
    DataAPIResponseNoCode<StreakLogin>
  > {
    const url = `${BACKEND_URL}/information/v1/count-unread-announcement`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetAchievement: async function (
    subjectId: string,
  ): Promise<DataAPIResponse<Achievement[]>> {
    const url = `${BACKEND_URL}/information/v1/achivement/subject/${subjectId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  GetLeaderBoard: async function (
    subjectId: string,
    tab: string = 'all',
    startDate: string,
    endDate: string,
  ): Promise<DataAPIResponse<LeaderboardResponse>> {
    const url = `${BACKEND_URL}/information/v1/leaderboard/subject/${subjectId}?filterType=${tab}&startDate=${startDate}&endDate=${endDate}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
};

export default RestAPIMainMenu;
