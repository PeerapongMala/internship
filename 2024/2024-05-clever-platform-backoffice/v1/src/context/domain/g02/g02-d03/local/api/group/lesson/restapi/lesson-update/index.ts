import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// ฟังก์ชันสำหรับการอัปเดต Sub Lesson
const LessonUpdate = async (
  id: number,
  body: {
    index?: number;
    name?: string;
    font_name?: string;
    font_size?: string;
    background_image_path: string;
    status?: string;
  },
) => {
  // remove if null
  // if (body.updated_by === null) {
  //     delete body.updated_by;
  // }

  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export default LessonUpdate;
