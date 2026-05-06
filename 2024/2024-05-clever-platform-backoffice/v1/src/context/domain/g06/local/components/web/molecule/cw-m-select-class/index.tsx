import CWSelect, { SelectOption, TCWSelectProps } from '@component/web/cw-select';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import API from '@domain/g06/local/api';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobalPersist from '@store/global/persist';
import { ChangeEvent, useEffect, useState } from 'react';

type SelectClassProps = TCWSelectProps & {
  className?: string;
  value?: number;
  academicYear?: number | null;
  year?: string;
  onChange?: (room: number) => void;
};

const SelectClass = ({
  value,
  className,
  onChange,
  academicYear,
  year,
  ...props
}: SelectClassProps) => {
  const userData = getUserData();

  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (!academicYear || !year) {
      setOptions([]);
      return;
    }

    fetchData(academicYear, String(year));
  }, [academicYear, year]);

  const fetchData = async (academicYear: number, year: string) => {
    try {
      const response = await API.Dropdown.GetClassList(
        Number(userData.school_id),
        year,
        String(academicYear),
      );

      if (response.status_code != 200) {
        throw new Error(response.message);
      }

      setOptions(
        response.data.map((item) => ({
          label: `ห้อง ${item}`,
          value: Number(item),
        })),
      );
    } catch (error) {
      showMessage((error as Error).message, 'error');
      throw error;
    }
  };

  return (
    <CWSelect
      options={options}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange?.(Number(e.target.value))}
      title="ห้องเรียน"
      className={cn('w-full max-w-[250px]', className)}
      disabled={props.disabled}
      {...props}
    />
  );
};

export default SelectClass;
