import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { ProvincialDashboardRepository } from '../../../repository/provincial-dashboard';
import { CompareProvinceDistrictResponse, ScoreOverviewResponse } from '../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ProvincialDashboardRestAPI: ProvincialDashboardRepository = {
  GetScoreOverview: function (
    start_date: string,
    end_date: string,
    province: string,
    district: string,
  ): Promise<DataAPIResponse<ScoreOverviewResponse>> {
    let url = `${BACKEND_URL}/admin-report/v1/report/province-district?start_date=${start_date}&end_date=${end_date}&province=${province}&district=${district}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ScoreOverviewResponse>) => {
        return res as DataAPIResponse<ScoreOverviewResponse>;
      });
  },
  GetCompareStatistics: function (
    start_date: string,
    end_date: string,
    province: string,
    sort_type: string,
    district: string,
  ): Promise<DataAPIResponse<CompareProvinceDistrictResponse>> {
    let url = `${BACKEND_URL}/admin-report/v1/report/compare-province-district?start_date=${start_date}&end_date=${end_date}&province=${province}&sort_type=${sort_type}&district=${district}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CompareProvinceDistrictResponse>) => {
        return res as DataAPIResponse<CompareProvinceDistrictResponse>;
      });
  },
};

export default ProvincialDashboardRestAPI;
