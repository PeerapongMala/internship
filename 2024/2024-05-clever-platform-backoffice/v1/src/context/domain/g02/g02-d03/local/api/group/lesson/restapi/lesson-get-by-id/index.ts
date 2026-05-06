import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
// ตั้งค่า axios instance
const LessonGetById = async (lessonId: string) => {
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/${lessonId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return await response.json();
};

export default LessonGetById;
