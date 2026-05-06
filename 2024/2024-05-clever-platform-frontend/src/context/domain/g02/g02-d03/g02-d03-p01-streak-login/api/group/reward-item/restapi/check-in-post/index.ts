import { DataAPIResponse } from '@core/helper/api-type';
import {
  CheckinRequest,
  CheckinResponse,
} from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const CheckInPost = async (
  body: CheckinRequest,
): Promise<DataAPIResponse<CheckinResponse>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/streak-login/v1/check-in/bulk-edit`;
  console.log(url);

  try {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const responseData = await response.json();

    return responseData as DataAPIResponse<CheckinResponse>;
  } catch (error) {
    console.error('Error during API request:', error);
    throw error;
  }
};

export default CheckInPost;
