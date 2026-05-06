import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// ฟังก์ชันสำหรับการสร้าง Sub Lesson
const LessonCreate = async (body: {
  subject_id?: number;
  index?: number;
  name?: string;
  font_name?: string;
  font_size?: string;
  status?: string;
  created_by?: string;
  updated_by?: string;
  admin_login_as?: string;
}): Promise<DataAPIResponse<any>> => {
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export default LessonCreate;
