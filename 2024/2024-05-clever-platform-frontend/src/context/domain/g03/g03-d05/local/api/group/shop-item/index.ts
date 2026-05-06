import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import {
  Badge,
  BadgeResponse,
  Coupon,
  CouponResponse,
  Frame,
  FrameResponse,
} from '../../../type';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const GetAllFrame = async (
  subject_id: string,
): Promise<DataAPIResponse<FrameResponse[]>> => {
  const url = `${backendURL}/main-menu/shop/v1/item?subject_id=${subject_id}&type=frame`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  //console.log('Frame API response: ', res_1);

  return res_1;
};

export const GetAllBadge = async (
  subject_id: string,
): Promise<DataAPIResponse<BadgeResponse[]>> => {
  const url = `${backendURL}/main-menu/shop/v1/item?subject_id=${subject_id}&type=badge`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log(
    '%cBadge API response:',
    'color: blue; font-weight: bold; font-size: 16px;',
    res_1,
  );

  return res_1;
};

export const GetAllCoupon = async (
  subject_id: string,
): Promise<DataAPIResponse<CouponResponse[]>> => {
  const url = `${backendURL}/main-menu/shop/v1/item?subject_id=${subject_id}&type=coupon`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log(
    '%cCoupon API response:',
    'color: blue; font-weight: bold; font-size: 16px;',
    res_1,
  );

  return res_1;
};

/// buy API

export const BuyFrame = async (frameId: number): Promise<DataAPIResponse<Frame>> => {
  const url = `${backendURL}/main-menu/shop/v1/item/buy`;

  const requestPayload = {
    shop_item_id: frameId,
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
    console.log('Buy Frame API response: ', res_1);

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
      } as DataAPIResponse<Frame>;
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
      } as DataAPIResponse<Frame>;
    }

    // Fallback if error is not an instance of Error
    return {
      status_code: 500,
      message: 'error',
      data: null,
      error: 'An unknown error occurred.',
    } as DataAPIResponse<Frame>;
  }
};

export const BuyBadge = async (badgeId: number): Promise<DataAPIResponse<Badge>> => {
  const url = `${backendURL}/main-menu/shop/v1/item/buy`;

  const requestPayload = {
    shop_item_id: badgeId,
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
    console.log('Buy Badge API response: ', res_1);

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
      } as DataAPIResponse<Badge>;
    }

    return res_1;
  } catch (error) {
    console.error('Error in BuyBadge:', error);

    // Use type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return {
        status_code: 500,
        message: 'error',
        data: null,
        error: error.message,
      } as DataAPIResponse<Badge>;
    }

    // Fallback if error is not an instance of Error
    return {
      status_code: 500,
      message: 'error',
      data: null,
      error: 'An unknown error occurred.',
    } as DataAPIResponse<Badge>;
  }
};

export const BuyCoupon = async (couponId: number): Promise<DataAPIResponse<Coupon>> => {
  const url = `${backendURL}/main-menu/shop/v1/item/buy`;

  const requestPayload = {
    shop_item_id: couponId,
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
    console.log('Buy Coupon API response: ', res_1);

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
      } as DataAPIResponse<Coupon>;
    }

    return res_1;
  } catch (error) {
    console.error('Error in BuyCoupon:', error);

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
    } as DataAPIResponse<Frame>;
  }
};
