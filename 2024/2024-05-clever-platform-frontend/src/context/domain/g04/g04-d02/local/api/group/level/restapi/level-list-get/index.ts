import {
  APITypeAPIResponse,
  convertToDataResponseList,
  DataAPIResponse,
} from '@core/helper/api-type';
import { Homework } from '@domain/g04/g04-d02/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { LevelList } from '../../../../../../g04-d02-p01-level/type';

const LevelListGet = async (
  subjectId: string,
): Promise<APITypeAPIResponse<LevelList[]>> => {
  try {
    const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
    const url = `${backendURL}/level/v1/level-detail/${subjectId}`;

    const response = await fetchWithAuth(url, {
      method: 'GET',
    });

    const data = await response.json();
    console.log('API Response:', data);

    return {
      ...response,
      json: () => {
        console.log('Parsed Data:', data.data);
        return data.data as LevelList[];
      },
    };
  } catch (error) {
    console.error('Error fetching level list:', error);
    throw error;
  }
};

export const GetHomeworkBySubjectId = async (
  subjectId: string,
): Promise<DataAPIResponse<Homework[]>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/level/v1/homework/subject/${subjectId}`;
  return fetchWithAuth(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<Homework[]>) => {
      if (res.status_code === 200) return convertToDataResponseList(res);
      return res;
    });
};
export default LevelListGet;
