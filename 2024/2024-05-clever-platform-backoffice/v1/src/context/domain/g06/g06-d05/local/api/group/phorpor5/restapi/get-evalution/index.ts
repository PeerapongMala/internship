import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { GetEvaluationForm } from '../../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const GetEvaluation = async (
  evaluationFormId: number,
): Promise<DataAPIResponse<GetEvaluationForm>> => {
  try {
    const url = `${BACKEND_URL}/grade-system-form/v1/evaluation-form/${evaluationFormId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const res = (await response.json()) as DataAPIResponse<GetEvaluationForm[]>;

    if (res.status_code === 200 && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data[0],
      } as DataAPIResponse<GetEvaluationForm>;
    }

    return res as DataAPIResponse<GetEvaluationForm>;
  } catch (error) {
    console.error('Failed to get evaluation:', error);
    throw error;
  }
};

export default GetEvaluation;
