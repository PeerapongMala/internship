import CWSelect from '@component/web/cw-select';
import useStore from '@domain/g01/g01-d09/local/stores';
import { useSchoolAffiliationStore } from '@domain/g01/g01-d09/local/stores/school-affiliation';

type SelectSchoolAffiliationIdProps = {
  value?: number | null;
  type?: string;
  onChange?: (id: number) => void;
};

const SelectSchoolAffiliationId = ({
  value,
  type,
  onChange,
}: SelectSchoolAffiliationIdProps) => {
  const saStore = useStore.schoolAffiliation();

  return (
    <CWSelect
      required
      title="ใช้ชื่อสังกัด (โรงเรียน สช)"
      className="w-full max-w-[265px]"
      value={value}
      options={
        type
          ? type === 'รัฐ'
            ? saStore.gov.map((gov) => ({ label: gov.name, value: gov.id }))
            : saStore.pri.map((pri) => ({ label: pri.name, value: pri.id }))
          : undefined
      }
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange?.(Number(e.target.value))
      }
    />
  );
};

export default SelectSchoolAffiliationId;
