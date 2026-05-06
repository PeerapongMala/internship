import CWSelect, { SelectOption } from '@component/web/cw-select';
import API from '@domain/g03/g03-d06-v2/local/api';
import { useEffect, useState } from 'react';

type SelectLessonDropdownProps = {
  subjectID: number;
  defaultValue?: number;
  onChange?: (lessonID: number) => void;
};

const SelectLessonDropdown = ({
  subjectID,
  defaultValue,
  onChange,
}: SelectLessonDropdownProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<number | undefined>(defaultValue);

  useEffect(() => {
    fetchLessons(subjectID);
  }, [subjectID]);

  const fetchLessons = async (subjectID: number) => {
    try {
      const response = await API.teacherHomework.GetLessonList(subjectID);
      if (response.status_code === 200) {
        const opts = response.data.map((data) => ({
          label: data.lesson_name,
          value: data.id,
        }));
        setOptions(opts);
        if (defaultValue) {
          setSelected(defaultValue);
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleChange = (e: any) => {
    const val = e.target.value;
    setSelected(val);
    onChange?.(val);
  };

  return <CWSelect options={options} value={selected} onChange={handleChange} />;
};

export default SelectLessonDropdown;
