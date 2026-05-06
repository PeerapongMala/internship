import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { ProvincialDashboardRepository } from '../../../repository/provincial-dashboard';
import { CompareProvinceDistrictResponse, ScoreOverviewResponse } from '../type';
import {
  PaginationAPIResponse,
  DataAPIRequest,
  pagination,
  responseOk,
  responseFailed,
  responseCreated,
  BasePaginationAPIQueryParams,
} from '../../../helper';

import COMPAR_PROVINCE_MOCK_DATA from './compare-province.json';
import PROVINCE_DISTRICT_MOCK_DATA from './province-district.json';

const ProvincialDashboardMock: ProvincialDashboardRepository = {
  GetScoreOverview: function (
    start_date: string,
    end_date: string,
    province: string,
    district: string,
  ): Promise<DataAPIResponse<ScoreOverviewResponse>> {
    let data = {
      total_school_count: 1,
      total_class_room_count: 1,
      total_student_count: 1,
      country_maximum_star_count: 0,
      avg_star_count: 0,
      percentage_star: 0,
      maximum_star_count: 0,
      minimum_star_count: 0,
    };
    const provinces = PROVINCE_DISTRICT_MOCK_DATA;
    const findData = provinces.find((item) => item.province === province);
    if (findData) {
      const districts = findData.districts.find((item) => item.district === district);
      if (districts) {
        data = districts.data;
      }
    }

    // return Promise.resolve(responseOk({ findData }));
    return Promise.resolve(responseOk({ data }));
  },
  GetCompareStatistics: function (
    start_date: string,
    end_date: string,
    province: string,
    sort_type: string,
  ): Promise<DataAPIResponse<CompareProvinceDistrictResponse>> {
    let data: CompareProvinceDistrictResponse = {
      stat_usage: [],
      over_all_province: {
        avg_country_star_count: 0,
        max_country_star_count: 0,
        percentage_star: 0,
        avg_star_count: 0,
        max_star_count: 0,
        min_star_count: 0,
      },
      tree_district: [],
    };
    const provinces = COMPAR_PROVINCE_MOCK_DATA;
    const findData = provinces.find((item) => item.pro_th === province);
    if (findData) {
      // data = findData.data as CompareProvinceDistrictResponse
      data = {
        ...findData.data,
        tree_district: findData.data.tree_district.map((district) => ({
          type: 'DistrictZone',
          max_star_count: district.MaxStarCount,
          avg_star_count: district.AvgStarCount,
          avg_pass_level: district.AvgPassLevel,
          children: district.children,
        })),
      } as CompareProvinceDistrictResponse;
    }

    // return Promise.resolve(responseOk({ findData }));
    return Promise.resolve(responseOk({ data }));
  },
};

export default ProvincialDashboardMock;
