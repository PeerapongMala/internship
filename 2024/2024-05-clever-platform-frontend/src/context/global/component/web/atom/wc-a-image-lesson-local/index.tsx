import StoreFile from '@store/global/lesson-files';
import { useEffect, useState } from 'react';

export default function ImageLessonLocal({
  src,
  query = {},
  alt,
  className,
}: {
  src: string;
  query?: {
    lessonId?: string;
    sublessonId?: string;
    levelId?: string;
    questionId?: string;
  };
  alt?: string;
  className?: string;
}) {
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  useEffect(() => {
    const load = async () => {
      const loadedBlob = await StoreFile.MethodGet().getItem(src, query);
      if (loadedBlob) setBlob(loadedBlob);
    };
    load();
  }, []);

  // if blob found in store
  if (blob) {
    const url = URL.createObjectURL(blob);
    return <img src={url} alt={alt} className={className} />;
  }

  // normal fetch
  return <img src={src} alt={alt} className={className} />;
}
