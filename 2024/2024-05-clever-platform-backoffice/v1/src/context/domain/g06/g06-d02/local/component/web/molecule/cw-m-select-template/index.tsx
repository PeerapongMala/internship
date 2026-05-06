import CWSelect, { SelectOption } from '@component/web/cw-select';
import { TEvaluationSelectProps } from '@domain/g06/g06-d02/local/types/props';
import { useEffect, useState } from 'react';
import API from '@domain/g06/g06-d02/local/api';
import showMessage from '@global/utils/showMessage';

type SelectTemplateProps = TEvaluationSelectProps & {
  schoolID: string;
  year?: string;
};

const SelectTemplate = ({
  value,
  year,
  name,
  schoolID,
  isSubmitStep,
  onChange,
  disabledEdit,
}: SelectTemplateProps) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    const data = await API.Grade.GetDropdownEvaluationTemplate(
      { school_id: schoolID, year: year },
      (error) => {
        showMessage('พบปัญหาในการดึงข้อมูล template', 'error');
      },
    );

    setOptions(
      data.data.map((template) => ({
        label: template.template_name,
        value: template.id,
      })),
    );
  };
  return (
    <CWSelect
      disabled={disabledEdit || !year}
      value={value}
      className="w-full"
      name={name}
      displayRequired
      required={isSubmitStep}
      label="เลือก Template:"
      onChange={(e) => onChange?.(Number(e.target.value))}
      options={options}
    />
  );
};

export default SelectTemplate;
