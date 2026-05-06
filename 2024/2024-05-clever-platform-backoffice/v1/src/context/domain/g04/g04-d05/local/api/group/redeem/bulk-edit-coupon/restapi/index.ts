import { Redeem } from '@domain/g04/g04-d05/local/type';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBaseResponse } from '../../../../helper/redeem';

export const bulkEditCoupon = async (redeems: Redeem[], status: Status) => {
  const payload = {
    bulk_edit_list: redeems.map((redeem) => ({
      coupon_id: redeem.id,
      status: status,
    })),
  };

  let response: AxiosResponse<Omit<TBaseResponse, '_pagination'>>;

  try {
    response = await axiosWithAuth.post('/redeem/v1/coupon/bulk-edit', payload);
  } catch (error) {
    throw error;
  }

  return response.data;
};
