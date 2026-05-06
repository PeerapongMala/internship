import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { ISessionCheckRequest, ISessionCheckResponse } from '../../../../types';

const CheckSession = async (
  req: ISessionCheckRequest,
): Promise<ISessionCheckResponse> => {
  try {
    const BACKEND_URL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
    const url = `${BACKEND_URL}/arcade-game/v1/platform/arcade/${req.arcadeGameId}/check`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data: ISessionCheckResponse = await response.json();
    return data;
  } catch (error) {
    console.error('CheckSession failed:', error);
    throw error;
  }
};

export default CheckSession;
