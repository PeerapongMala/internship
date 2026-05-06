import CWSelect from '@component/web/cw-select';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import API from '@domain/g06/g06-d01/local/api';
import { TSubject } from '@domain/g06/g06-d01/local/type/subject';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type SelectSubjectCleverProps = {
  onChange?: (value: number) => void;
  value?: number;
  disabled?: boolean;
};

const SelectSubjectClever = ({ onChange, value, disabled }: SelectSubjectCleverProps) => {
  const userData = getUserData();

  const [subjects, setSubjects] = useState<TSubject[]>([]);

  useEffect(() => {
    fetchSubjectLists();
  }, []);

  const fetchSubjectLists = async () => {
    let response: AxiosResponse<TBasePaginationResponse<TSubject>, any>;
    try {
      response = await API.AdminSchool.GetSubjectBySchoolID(userData.school_id);
    } catch (error) {
      showMessage('พบปัญหาในการเรียกค่ากับเซิร์ฟเวอร์', 'error');
      throw error;
    }

    setSubjects(response.data.data);
  };

  return (
    <CWSelect
      disabled={disabled}
      value={value}
      options={subjects.map((subject) => ({
        label: subject.subject_name,
        value: subject.subject_id,
      }))}
      onChange={(e) => onChange?.(Number(e.target.value))}
    />
  );
};

export default SelectSubjectClever;
