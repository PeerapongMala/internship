import { BaseAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { IGetPhorpor5Detail, IUpdatePhorpor5Request } from '../../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const UpdateDetailPhorpor5 = async (
  evaluationFormId: number,
  data: IGetPhorpor5Detail[], // เปลี่ยนจาก Partial เป็น array โดยตรง
): Promise<BaseAPIResponse | undefined> => {
  try {
    // เตรียมข้อมูลให้ตรงกับที่ API ต้องการ
    const payload = data.map((item) => ({
      id: item.id, // ต้องมี field นี้
      data_json: item.data_json, // ต้องมี field นี้
    }));

    const response = await fetchWithAuth(
      `${BACKEND_URL}/porphor5/v1/${evaluationFormId}/detail`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: payload, // ส่งข้อมูลในรูปแบบที่ API ต้องการ
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = (await response.json()) as BaseAPIResponse;
    return result;
  } catch (error) {
    console.error('UpdateDetailPhorpor5 Error:', error);
    return undefined;
  }
};

export default UpdateDetailPhorpor5;
