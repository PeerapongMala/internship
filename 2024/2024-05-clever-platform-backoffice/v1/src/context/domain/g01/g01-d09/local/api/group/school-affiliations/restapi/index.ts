import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TReqGetAllSchoolAffiliations,
  TReqGetLaoSchoolAffiliations,
  TReqGetSchoolAffiliations,
  TResGetLaoSchoolAffiliations,
  TResGetSchoolAffiliations,
} from '../../../helper/school_affiliation';
import { AxiosResponse } from 'axios';
import { TReqPagination } from '../../../helper/pagination';

export const getSchoolAffiliations = async (params: TReqGetSchoolAffiliations) => {
  let response: AxiosResponse<TResGetSchoolAffiliations>;

  try {
    response = await axiosWithAuth.get('/school-affiliations/v1', {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  return response.data;
};

export const getAllSchoolAffiliations = async (params: TReqGetAllSchoolAffiliations) => {
  let paramsPayload: TReqPagination & TReqGetAllSchoolAffiliations = {
    ...params,
    page: 1,
    limit: 1,
  };

  let firstRes: TResGetSchoolAffiliations;
  try {
    firstRes = await getSchoolAffiliations(paramsPayload);
  } catch (error) {
    throw error;
  }

  const itemCount = firstRes._pagination.total_count;
  const limit = 100;
  const totalPages = Math.ceil(itemCount / limit);

  const fetchPage = async (page: number) => {
    const payload = { ...params, page, limit };
    return await getSchoolAffiliations(payload);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const allResults: TResGetSchoolAffiliations[] = [];

  // Fetch data in chunks with a delay between requests
  for (let page = 1; page <= totalPages; page++) {
    try {
      const result = await fetchPage(page);
      allResults.push(result);

      if (page < totalPages) {
        await delay(1000);
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      throw error;
    }
  }

  return allResults;
};

export const getLaoSchoolAffiliations = async (
  params: TReqPagination & TReqGetLaoSchoolAffiliations,
) => {
  let response: AxiosResponse<TResGetLaoSchoolAffiliations>;

  try {
    response = await axiosWithAuth.get('/school-affiliations/v1/lao', {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  return response.data;
};

export const getAllLaoSchoolAffiliations = async (
  params: TReqGetLaoSchoolAffiliations,
) => {
  let paramsPayload: TReqPagination & TReqGetLaoSchoolAffiliations = {
    ...params,
    page: 1,
    limit: 1,
  };

  let firstRes: TResGetLaoSchoolAffiliations;
  try {
    firstRes = await getLaoSchoolAffiliations(paramsPayload);
  } catch (error) {
    throw error;
  }

  const itemCount = firstRes._pagination.total_count;
  const limit = 100;
  const totalPages = Math.ceil(itemCount / limit);

  const fetchPage = async (page: number) => {
    const payload = { ...params, page, limit };
    return await getLaoSchoolAffiliations(payload);
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const allResults: TResGetLaoSchoolAffiliations[] = [];

  // Fetch data in chunks with a delay between requests
  for (let page = 1; page <= totalPages; page++) {
    try {
      const result = await fetchPage(page);
      allResults.push(result);

      if (page < totalPages) {
        await delay(1000);
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      throw error;
    }
  }

  return allResults;
};
