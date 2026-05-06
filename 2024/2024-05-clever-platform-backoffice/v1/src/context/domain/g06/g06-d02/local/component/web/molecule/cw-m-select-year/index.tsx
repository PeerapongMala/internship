import CWSelect from '@component/web/cw-select';
import { TEvaluationSelectProps } from '@domain/g06/g06-d02/local/types/props';
import { useEffect, useState } from 'react';
import { SelectOption } from '@domain/g02/g02-d05/local/type';
import API from '@domain/g06/g06-d02/local/api';

type SelectYearProps = TEvaluationSelectProps;

const SelectYear = ({
  value,
  name,
  isSubmitStep,
  defaultValue,
  onChange,
  disabledEdit,
}: SelectYearProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await API.Dropdown.GetSeedYearList();
    if (data.status_code != 200) return;

    setOptions(
      data.data.map((year) => ({
        label: year,
        value: year,
      })),
    );
  };
  return (
    <CWSelect
      disabled={disabledEdit}
      onChange={(e) => onChange?.(e.target.value)}
      value={value}
      defaultValue={defaultValue}
      name={name}
      className="w-full"
      displayRequired
      required={isSubmitStep}
      label="ชั้นปี:"
      options={options}
    />
  );
};

export default SelectYear;
