import CWSelect, { SelectOption } from '@component/web/cw-select';
import { TEvaluationSelectProps } from '@domain/g06/g06-d02/local/types/props';
import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d02/local/api';

type SelectAcademicYearProps = TEvaluationSelectProps;

const SelectAcademicYear = ({
  disabledEdit,
  name,
  value,
  isSubmitStep,
  onChange,
}: SelectAcademicYearProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await API.Dropdown.GetSeedAcaDemicYearList();

    if (data.status_code != 200) return;

    setOptions(
      data.data.map((year) => ({
        label: year?.toString(),
        value: year,
      })),
    );
  };

  return (
    <CWSelect
      disabled={disabledEdit}
      value={value}
      className="w-full"
      name={name}
      displayRequired
      required={isSubmitStep}
      onChange={(e) => onChange?.(e.target.value)}
      label="ปีการศึกษา:"
      options={options}
    />
  );
};

export default SelectAcademicYear;
