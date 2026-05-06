import { DataAPIResponse } from '@core/helper/api-type';
import { UseItem } from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const UseItemPost = async (body: {
  subject_id: number;
  use_coin_flag: boolean;
  gold_coin_amount: number;
  use_item_flag: boolean;
}): Promise<DataAPIResponse<UseItem>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/streak-login/v1/use-item`;
  console.log(505050);

  try {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const responseData: DataAPIResponse<UseItem> = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error during API request:', error);
    throw error;
  }
};

export default UseItemPost;
