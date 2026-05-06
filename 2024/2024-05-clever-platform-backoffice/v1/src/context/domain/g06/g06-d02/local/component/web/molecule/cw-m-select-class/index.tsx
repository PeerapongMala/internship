import CWSelect, { SelectOption } from '@component/web/cw-select';
import { TEvaluationSelectProps } from '@domain/g06/g06-d02/local/types/props';
import { useState, useEffect } from 'react';
import API from '@domain/g06/g06-d02/local/api';

type SelectClassProps = TEvaluationSelectProps & {
  schoolID: string;
  selectedYear: string;
  selectedAcademicYear: string;
};

const SelectClass = ({
  value,
  name,
  schoolID,
  selectedAcademicYear,
  selectedYear,
  isSubmitStep,
  onChange,
  disabledEdit,
}: SelectClassProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, [selectedAcademicYear, selectedYear]);

  const fetchData = async () => {
    if (!selectedAcademicYear || !selectedYear) return;

    const data = await API.Dropdown.GetClassList(
      Number(schoolID),
      selectedYear,
      selectedAcademicYear,
    );

    if (data.status_code != 200) return;

    setOptions(
      data.data.map((id) => ({
        label: id,
        value: id,
      })),
    );
  };

  return (
    <CWSelect
      disabled={
        // Disable editing if:
        // - Editing is globally turned off, OR
        // - Either the academic year or the year is not selected and we're not at the submit step.
        disabledEdit || ((!selectedAcademicYear || !selectedYear) && !isSubmitStep)
      }
      value={value}
      className="w-full"
      name={name}
      displayRequired
      required={isSubmitStep}
      onChange={(e) => onChange?.(e.target.value)}
      label="ห้องเรียน:"
      options={options}
    />
  );
};

export default SelectClass;
