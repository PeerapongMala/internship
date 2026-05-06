import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
// ฟังก์ชันสำหรับการสร้าง Sub Lesson
const SubLessonCreate = async (body: {
  lesson_id: number;
  indicator_id: number;
  name?: string;
  status?: string;
  created_by: string;
  updated_by: string;
  admin_login_as?: string;
}) => {
  let url = `${BACKEND_URL}/academic-sub-lesson/v1/sub-lessons`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export default SubLessonCreate;
