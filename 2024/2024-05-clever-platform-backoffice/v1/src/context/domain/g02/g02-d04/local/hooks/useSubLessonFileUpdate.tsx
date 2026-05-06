import showMessage from '@global/utils/showMessage';
import API from '../api';
import { useState } from 'react';

export const useSubLessonFileUpdate = () => {
  const [fetching, setFetching] = useState<boolean>(false);

  const handleSubLessonUpdate = (ids: number[], onSuccess?: () => void) => {
    setFetching(true);
    API.Sublesson.SubLessonFileUpdate.Post(ids)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('อัปเดตบทเรียนย่อยสำเร็จ', 'success');
          onSuccess?.();
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => {
        console.error('Error updating sub lessons:', error);
        showMessage('เกิดข้อผิดพลาดในการอัปเดตบทเรียนย่อย', 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return {
    handleSubLessonUpdate,
    isFetchSubLessonFileUpdate: fetching,
  };
};
