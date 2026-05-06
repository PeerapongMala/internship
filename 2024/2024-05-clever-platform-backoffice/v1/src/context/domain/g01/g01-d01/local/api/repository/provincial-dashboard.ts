import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import {
  CompareProvinceDistrictResponse,
  ScoreOverviewResponse,
} from '../group/provincial-dashboard/type';

export interface ProvincialDashboardRepository {
  GetScoreOverview(
    start_date: string,
    end_date: string,
    province: string,
    district: string,
  ): Promise<DataAPIResponse<ScoreOverviewResponse>>;
  GetCompareStatistics(
    start_date: string,
    end_date: string,
    province: string,
    sort_type: string,
    district: string,
  ): Promise<DataAPIResponse<CompareProvinceDistrictResponse>>;
}
