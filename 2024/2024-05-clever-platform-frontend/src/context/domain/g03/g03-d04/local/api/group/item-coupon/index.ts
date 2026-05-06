import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth, updateWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { Coupon, CouponResponse } from '../../../types';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllCoupon = async (): Promise<DataAPIResponse<CouponResponse[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-coupon`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log('Frame API response: ', res_1);

  // Fallback: Return mock data if the API response is null or missing the data property.
  //   if (!res_1 || res_1.data == null) {
  //     console.warn('API returned null data, falling back to mockCharacter');
  //     return mockCharacter as DataAPIResponse<FrameResponse[]>;
  //   }
  return res_1;
};

export const UpdateCoupon = async (
  item_id: number | undefined,
  isEquipped: boolean,
): Promise<DataAPIResponse<Coupon>> => {
  if (!item_id) {
    console.error('Invalid item_id, cannot proceed with UpdateFrame');
    return {
      status_code: 400,
      message: 'Invalid item_id',
      data: null,
      error: 'Missing or invalid item_id',
    } as DataAPIResponse<Coupon>;
  }

  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/item-coupon`;
  const updatedCouponPayload = {
    item_id: item_id,
    is_equipped: isEquipped,
  };

  console.log('Payload being sent to the API:', updatedCouponPayload);

  try {
    const res = await updateWithAuth(url, updatedCouponPayload);
    const res_1 = await res.json();

    console.log('UpdateCharacter API response:', res_1);

    // Check if the API response is invalid or missing data.
    if (!res_1 || res_1.data == null) {
      console.warn('API update returned null data, falling back to mockFrame');
    }

    return res_1;
  } catch (error) {
    console.error('Error during UpdateCoupon API call:', error);
    return {
      status_code: 500,
      message: 'API call failed',
      data: null,
    } as DataAPIResponse<Coupon>;
  }
};

export const UseCoupon = async (item_id: number): Promise<DataAPIResponse<Coupon>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/use-coupon`;

  const requestPayload = {
    item_id: item_id,
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
    console.log('UseCoupon API response: ', res_1);

    if (!res_1 || res_1.data == null) {
      return {
        status_code: 200,
        message: 'success (mock update)',
        data: {
          id: 1,
          stock: 100,
          initial_stock: 100,
          price: 50,
          item_id: 123,
          name: 'Discount Coupon',
          description: 'A great discount',
          image_url: 'http://example.com/img.png',
          template_path: '/path/to/template',
          badge_description: '10% Off',
          amount: 10,
          is_bought: false,
          is_equipped: false,
        },
      };
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
      } as DataAPIResponse<Coupon>;
    }

    // Fallback if error is not an instance of Error
    return {
      status_code: 500,
      message: 'error',
      data: null,
      error: 'An unknown error occurred.',
    } as DataAPIResponse<Coupon>;
  }
};
