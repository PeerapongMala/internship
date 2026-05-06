import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { IBuyTokenResponse } from '../../../../types';

const BuyToken = async (req: { arcadeGameId: string }): Promise<IBuyTokenResponse> => {
  try {
    const BACKEND_URL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
    const url = `${BACKEND_URL}/arcade-game/v1/platform/arcade/${req.arcadeGameId}/buy`;

    const response = await fetchWithAuth(url, { method: 'GET' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data: IBuyTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error('BuyToken failed:', error);
    throw error;
  }
};

export default BuyToken;
