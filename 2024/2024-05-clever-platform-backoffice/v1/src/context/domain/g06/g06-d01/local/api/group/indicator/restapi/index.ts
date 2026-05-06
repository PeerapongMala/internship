import { DataAPIResponse } from '../../../helper';
import { IndicatorsRepository } from '../../../repository';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { Indicators } from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const IndicatorRestAPI: IndicatorsRepository = {
  GetById: function (indicator_id: number): Promise<DataAPIResponse<Indicators>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/indicator/${indicator_id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicators[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Indicators>;
        return res as DataAPIResponse<Indicators>;
      });
  },

  Update: function (
    indicator_id: number,
    indicators: Partial<Indicators>,
  ): Promise<DataAPIResponse<Indicators>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/indicator/${indicator_id}`;
    const body = JSON.stringify(indicators);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicators>) => {
        return res;
      });
  },
};

export default IndicatorRestAPI;
