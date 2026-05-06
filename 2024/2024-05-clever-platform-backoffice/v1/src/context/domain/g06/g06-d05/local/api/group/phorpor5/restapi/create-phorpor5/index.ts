import { BaseAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CreatePhorpor5 = async (id: number): Promise<BaseAPIResponse | undefined> => {
  try {
    const response = await fetchWithAuth(`${BACKEND_URL}/porphor5/v1/${id}/create`, {
      method: 'POST',
    });

    const data = (await response.json()) as BaseAPIResponse;

    // ถ้า APITypeAPIResponse เป็น Promise ต้องใช้ Promise.resolve()
    return data as BaseAPIResponse;
  } catch (error) {
    console.error('CreatePhorpor5 Error:', error);
    return undefined;
  }
};

export default CreatePhorpor5;
