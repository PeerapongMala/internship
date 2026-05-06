import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const LessonSort = async (
  subjectID: number,
  items: {
    lessons: {
      [key: string]: number;
    };
  },
) => {
  console.log({ items: items });
  let url = `${BACKEND_URL}/academic-lesson/v1/${subjectID}/lessons/sort`;
  const response = await fetchWithAuth(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(items),
  });

  return await response.json();
};

export default LessonSort;
