import CWSelect from '@component/web/cw-select';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import { useMemo } from 'react';

type SelectTemplateTypeProps = {
  className?: string;
  value?: string;
  onChange?: (value: EGradeTemplateType) => void;
};

const SelectTemplateType = ({ className, onChange, value }: SelectTemplateTypeProps) => {
  const options = useMemo(() => {
    return Object.values(EGradeTemplateType).map((type) => ({
      label: type,
      value: type,
    }));
  }, []);

  return (
    <CWSelect
      className={className}
      label={'ประเภท'}
      options={options}
      required
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

export default SelectTemplateType;
