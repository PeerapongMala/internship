import CWSelect from '@component/web/cw-select';

type SelectTypeSchoolAffiliationProps = {
  value?: string;
  onChange?: (type: string) => void;
};
const SelectTypeSchoolAffiliation = ({
  value,
  onChange,
}: SelectTypeSchoolAffiliationProps) => {
  return (
    <CWSelect
      required
      title="เอกชน"
      className="w-full max-w-[265px]"
      value={value}
      options={[
        { label: 'เอกชน', value: 'เอกชน' },
        { label: 'รัฐ', value: 'รัฐ' },
      ]}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
    />
  );
};

export default SelectTypeSchoolAffiliation;
