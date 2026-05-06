import CWSelect, { SelectOption } from '@component/web/cw-select';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import API from '@domain/g06/local/api';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobalPersist from '@store/global/persist';
import { ChangeEvent, useEffect, useState } from 'react';

type SelectAcademicYearProps = {
  className?: string;
  label?: string;
  name?: string;
  required?: boolean;
  displayRequired?: boolean;
  value?: number;
  disabled?: boolean;
  onChange?: (academicYear: number) => void;
};

const SelectAcademicYear = ({
  value,
  name,
  className,
  label,
  required,
  displayRequired,
  disabled,
  onChange,
}: SelectAcademicYearProps) => {
  const userData = getUserData();

  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.Teacher.GetAcademicYearBySchoolID({
        school_id: Number(userData.school_id),
        limit: -1,
      });

      setOptions(
        response.data.data.map((item) => ({
          label: `ปีการศึกษา ${item.name}`,
          value: Number(item.name),
        })),
      );
    } catch (error) {
      showMessage((error as Error).message, 'error');
      throw error;
    }
  };

  return (
    <CWSelect
      name={name}
      label={label}
      required={required}
      displayRequired={displayRequired}
      disabled={disabled}
      options={options}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange?.(Number(e.target.value))}
      title="ปีการศึกษา"
      className={cn('w-full max-w-[250px]', className)}
    />
  );
};

export default SelectAcademicYear;
