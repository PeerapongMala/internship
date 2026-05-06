import CWSelect from '@component/web/cw-select';
import API from '@domain/g06/g06-d02/local/api';
import showMessage from '@global/utils/showMessage';
import { ChangeEvent, useEffect, useState } from 'react';

type DropdownYearListProps = {
  value: string;
  onChange?: (value: string) => void;
};

const DropdownYearList = ({ value, onChange }: DropdownYearListProps) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await API.Dropdown.GetSeedYearList();
      if (data?.status_code === 200) {
        setOptions(
          data.data.map((year) => ({
            label: year,
            value: year,
          })),
        );
      }
    } catch (error) {
      showMessage('พบปัญหาในการเรียกค่าชั้นปีกับเซิร์ฟเวอร์', 'error');
      throw error;
    }
  };

  return (
    <CWSelect
      title={'ชั้นปี'}
      value={value}
      options={options}
      className="max-w-[250px]"
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value);
      }}
    />
  );
};

export default DropdownYearList;
