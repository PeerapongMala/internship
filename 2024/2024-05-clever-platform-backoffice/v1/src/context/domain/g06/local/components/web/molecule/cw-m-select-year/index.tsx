import CWSelect, { SelectOption, TCWSelectProps } from '@component/web/cw-select';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import API from '@domain/g06/local/api';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import StoreGlobalPersist from '@store/global/persist';
import { ChangeEvent, useEffect, useState } from 'react';

type SelectYearProps = TCWSelectProps & {
  className?: string;
  value?: string;
  onChange?: (academicYear: string) => void;
};

const SelectYear = ({ value, className, onChange, ...props }: SelectYearProps) => {
  const userData = getUserData();

  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.Year.Gets(Number(userData.school_id), {
        limit: -1,
      });

      if (response.status_code != 200) {
        throw new Error(response.message);
      }

      setOptions(
        response.data.map((item) => ({
          label: String(item.name),
          value: item.short_name,
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
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
      title="ชั้นปี"
      className={cn('w-full max-w-[250px]', className)}
      disabled={props.disabled}
      {...props}
    />
  );
};

export default SelectYear;
