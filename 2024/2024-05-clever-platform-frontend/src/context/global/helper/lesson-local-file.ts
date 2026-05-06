import { useEffect, useState } from 'react';
import StoreFile from '@store/global/lesson-files';

export function useLessonLocal({
  query = {},
  src,
}: {
  query?: {
    lessonId?: string;
    sublessonId?: string;
    levelId?: string;
    questionId?: string;
  };
  src: string;
}) {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const load = async () => {
      const loadedBlob = await StoreFile.MethodGet().getItem(src, query);
      if (loadedBlob) {
        setBlob(loadedBlob);
      } else {
        setUrl(src);
      }
    };
    load();
  }, [src, query]);

  useEffect(() => {
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);

      // Clean up the object URL when the component unmounts or when the blob changes
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [blob]);

  return url;
}
