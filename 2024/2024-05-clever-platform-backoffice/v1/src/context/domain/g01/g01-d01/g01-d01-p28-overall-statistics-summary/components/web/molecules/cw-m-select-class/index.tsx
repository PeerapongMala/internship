import CWSelect, { SelectOption } from '@component/web/cw-select';
import API from '@domain/g01/g01-d04/local/api';
import { useEffect, useState } from 'react';

type SelectYearProps = {
  year: string;
  onYearChange?: (year: string) => void;
};

const SelectYear = ({ year, onYearChange }: SelectYearProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await API.schoolStudent.GetSeedYears();

    if (res.status_code == 200) {
      setOptions(
        res.data.map((year) => ({ label: year.short_name, value: year.short_name })),
      );
    }
  };

  return (
    <div>
      <CWSelect
        title="เลือกระดับชั้น"
        options={options}
        value={year}
        onChange={(e) => onYearChange?.(e.target.value)}
      />
    </div>
  );
};

export default SelectYear;
