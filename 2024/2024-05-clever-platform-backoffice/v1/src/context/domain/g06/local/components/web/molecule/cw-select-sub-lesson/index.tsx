import CWSelect from '@component/web/cw-select';
import API from '@domain/g06/local/api';
import { TSubLesson } from '@domain/g06/local/types/academic';
import { useEffect, useState } from 'react';

type SelectSubLessonProps = {
  disabled?: boolean;
  lessonID?: number;
  selectedSubLesson?: TSubLesson | Partial<TSubLesson>;
  onSelectSubLesson?: (subLesson: TSubLesson) => void;
};

const SelectSubLesson = ({
  lessonID,
  selectedSubLesson,
  onSelectSubLesson,
  disabled,
}: SelectSubLessonProps) => {
  const [subLesson, setSubLesson] = useState<TSubLesson[]>([]);

  useEffect(() => {
    if (lessonID) fetchSubLesson(lessonID);
  }, [lessonID]);
  const fetchSubLesson = async (lessonID: number) => {
    const response = await API.Academic.GetSubLessonByLessonID(lessonID, { limit: -1 });

    // for first time load. because there no indicator_id store in db
    // so need to get by selectedSubLessonID
    if (!selectedSubLesson?.indicator_id) {
      const sl = response.data.data.find((sl) => sl.id === selectedSubLesson?.id);
      if (sl) onSelectSubLesson?.(sl);
    }

    setSubLesson(response.data.data);
  };

  return (
    <CWSelect
      value={subLesson.findIndex((sl) => sl.id === selectedSubLesson?.id)}
      disabled={disabled}
      className="w-full"
      required={!disabled}
      label="บทเรียนย่อย"
      options={subLesson.map((sl, index) => ({ label: sl.name, value: index }))}
      onChange={(e) => {
        const index = e.target.value as number;
        onSelectSubLesson?.(subLesson[index]);
      }}
    />
  );
};

export default SelectSubLesson;
