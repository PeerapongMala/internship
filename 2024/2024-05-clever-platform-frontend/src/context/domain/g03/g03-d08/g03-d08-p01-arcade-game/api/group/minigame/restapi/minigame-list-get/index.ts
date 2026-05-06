import { PaginationAPIResponse } from '@core/helper/api-type';
import { MinigameList } from '@domain/g03/g03-d08/g03-d08-p01-arcade-game/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const MinigameListGet = async (): Promise<PaginationAPIResponse<MinigameList>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/arcade-game/v1/arcade-game`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });
  const data = await response.json();

  return data as PaginationAPIResponse<MinigameList>;
};

export default MinigameListGet;
