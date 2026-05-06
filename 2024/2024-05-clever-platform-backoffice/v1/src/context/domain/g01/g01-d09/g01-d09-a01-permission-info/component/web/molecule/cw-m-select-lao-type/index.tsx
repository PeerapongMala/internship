import CWSelect from '@component/web/cw-select';
import { ELaoType } from '@domain/g01/g01-d09/local/api/helper/school_affiliation';

type SelectLaoTypeProps = {
  value?: string;
  onChange?: (type: ELaoType | string) => void;
};

const getLaoTypeLabel = (type: ELaoType): string => {
  return type;
};

const SelectLaoType = ({ value, onChange }: SelectLaoTypeProps) => {
  // Generate options from ELaoType enum
  const laoTypeOptions = Object.values(ELaoType).map((type) => ({
    label: getLaoTypeLabel(type),
    value: type,
  }));

  const sortedOptions = laoTypeOptions.sort((a, b) =>
    a.label.localeCompare(b.label, 'th'),
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) {
      onChange?.(e.target.value);
      return;
    }

    const selectedValue = e.target.value;
    if (Object.values(ELaoType).includes(selectedValue as ELaoType)) {
      onChange?.(selectedValue as ELaoType);
    }
  };

  return (
    <CWSelect
      required
      title="อบจ อบต"
      className="w-full max-w-[265px]"
      value={value}
      options={sortedOptions}
      onChange={handleChange}
    />
  );
};

export default SelectLaoType;
