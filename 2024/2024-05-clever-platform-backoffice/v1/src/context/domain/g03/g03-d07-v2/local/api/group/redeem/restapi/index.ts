import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { RedeemFilterQueryParams, RedeemRepository } from '../../../repository/redeem';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import StoreGlobalPersist from '@store/global/persist';
import { StatusRedeem } from '../../../types/redeem';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RedeemRestAPI: RedeemRepository = {
  GetsRedeem: function (
    query: RedeemFilterQueryParams,
  ): Promise<PaginationAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/coupon-transactions`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
        return res;
      });
  },
  ToggleStatus: async function (
    couponTransactionId: number,
    isEnabled: StatusRedeem,
  ): Promise<DataAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/coupon-transactions/${couponTransactionId}`;

    const body = JSON.stringify({ status: isEnabled });
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any>) => {
        return res;
      });
  },
};

export default RedeemRestAPI;
