import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Pet, PetResponse } from '../../../type';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllPet = async (): Promise<DataAPIResponse<PetResponse[]>> => {
  const url = `${backendURL}/main-menu/shop/v1/pet`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  //console.log('Pet avatar API response: ', res_1);

  return res_1;
};

export const BuyPet = async (petId: number): Promise<DataAPIResponse<Pet>> => {
  const url = `${backendURL}/main-menu/shop/v1/pet/buy`;

  const requestPayload = {
    pet_id: petId,
  };

  try {
    const res = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const res_1 = await res.json();
    console.log('Buy Pet API response: ', res_1);

    if (!res_1 || (res_1.status_code === 200 && res_1.message === 'Bought')) {
      return res_1;
    }

    // Return error responses (like 409, 500) as-is without checking data
    if (res_1.status_code !== 200) {
      return res_1;
    }

    if (!res_1 || res_1.data == null) {
      return {
        status_code: 500,
        message: 'error: missing data',
        data: null,
        error: 'Backend returned null or no data.',
      } as DataAPIResponse<Pet>;
    }

    return res_1;
  } catch (error) {
    console.error('Error in BuyAvatar:', error);

    // Use type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return {
        status_code: 500,
        message: 'error',
        data: null,
        error: error.message,
      } as DataAPIResponse<Pet>;
    }

    // Fallback if error is not an instance of Error
    return {
      status_code: 500,
      message: 'error',
      data: null,
      error: 'An unknown error occurred.',
    } as DataAPIResponse<Pet>;
  }
};
