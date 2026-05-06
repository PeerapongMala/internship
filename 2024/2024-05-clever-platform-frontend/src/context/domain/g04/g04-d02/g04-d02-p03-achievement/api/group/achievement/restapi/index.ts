import { PaginationAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobalPersist from '@store/global/persist';
import { AchievementRepository } from '../../../repository';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPIAchievement: AchievementRepository = {
  Gets: async function (subjectId: string): Promise<PaginationAPIResponse<any>> {
    const url = `${BACKEND_URL}/information/v1/achivement/subject/${subjectId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
};

export default RestAPIAchievement;
