import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { IGetPhorpor5List } from '../../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const GetPhorpor5List = async (
  evaluationFormId: number,
): Promise<DataAPIResponse<IGetPhorpor5List[]> | undefined> => {
  try {
    const response = await fetchWithAuth(
      `${BACKEND_URL}/porphor5/v1/${evaluationFormId}/list`,
      {
        method: 'GET',
      },
    );

    const data = (await response.json()) as DataAPIResponse<IGetPhorpor5List[]>;

    return data;
  } catch (error) {
    console.error('CreatePhorpor5 Error:', error);
    return undefined;
  }
};

export default GetPhorpor5List;
