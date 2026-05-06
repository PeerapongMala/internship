import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Avatar, AvatarResponse } from '../../../type';

import CustomAvatarAPI from '@domain/g03/g03-d04/local/api';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllAvatar = async (): Promise<DataAPIResponse<AvatarResponse[]>> => {
  const url = `${backendURL}/main-menu/shop/v1/avatar`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  //console.log('Shop avatar API response: ', res_1);

  return res_1;
};

export const BuyAvatar = async (avatarId: number): Promise<DataAPIResponse<Avatar>> => {
  const url = `${backendURL}/main-menu/shop/v1/avatar/buy`;

  const requestPayload = {
    avatar_id: avatarId,
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
    console.log('BuyAvatar API response: ', res_1);

    // Check for insufficient funds (409) before calling UpdateCharacter
    if (res_1.status_code === 409) {
      return res_1;
    }

    // Only call UpdateCharacter if purchase was successful
    if (res_1.status_code === 200) {
      CustomAvatarAPI.Character.UpdateCharacter.Patch(avatarId, true);
    }

    if (!res_1 || res_1.data == null) {
      return {
        status_code: 500,
        message: 'success (mock update)',
        data: {
          id: 0,
          model_id: 0,
          is_equipped: false,
          is_bought: 'mock',
          price: 0,
        },
        error: null,
      } as DataAPIResponse<Avatar>;
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
      } as DataAPIResponse<Avatar>;
    }

    // Fallback if error is not an instance of Error
    return {
      status_code: 500,
      message: 'error',
      data: null,
      error: 'An unknown error occurred.',
    } as DataAPIResponse<Avatar>;
  }
};
