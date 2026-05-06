import CWSelect from '@component/web/cw-select';
import API from '@domain/g06/local/api';
import { TLesson } from '@domain/g06/local/types/academic';
import { useEffect, useState } from 'react';

type SelectLessonProps = {
  disabled?: boolean;
  subjectID: number;
  value?: number;
  onChange?: (lessonID?: number) => void;
};

const SelectLesson = ({ subjectID, value, onChange, disabled }: SelectLessonProps) => {
  const [lessons, setLessons] = useState<TLesson[]>([]);

  useEffect(() => {
    fetchLessons();
  }, []);
  const fetchLessons = async () => {
    const res = await API.Academic.GetLessonByLessonID(subjectID, {
      limit: -1,
      no_details: true,
    });

    setLessons(res.data.data);
  };

  return (
    <CWSelect
      disabled={disabled}
      value={value}
      options={lessons.map((lesson) => ({ label: lesson.name, value: lesson.id }))}
      className="w-full"
      required={!disabled}
      label="บทเรียนหลัก"
      onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
    />
  );
};

export default SelectLesson;
