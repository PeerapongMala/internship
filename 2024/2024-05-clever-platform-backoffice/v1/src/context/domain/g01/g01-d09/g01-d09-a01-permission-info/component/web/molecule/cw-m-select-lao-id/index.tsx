import { useEffect } from 'react';
import CWSelect from '@component/web/cw-select';
import { ELaoType } from '@domain/g01/g01-d09/local/api/helper/school_affiliation';
import { useLaoSchoolAffiliationStore } from '@domain/g01/g01-d09/local/stores/school-affiliation';

type SelectLaoIdProps = {
  value?: number | null;
  type?: string;
  onChange?: (id: number) => void;
};

const SelectLaoId = ({ value, type, onChange }: SelectLaoIdProps) => {
  const saStore = useLaoSchoolAffiliationStore();

  useEffect(() => {
    saStore.fetchData();
  }, []);

  return (
    <CWSelect
      className="w-full max-w-[265px]"
      value={value}
      options={saStore.laoData[type as ELaoType]?.map((lao) => ({
        label: lao.name,
        value: lao.id,
      }))}
      required
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange?.(Number(e.target.value));
      }}
    />
  );
};

export default SelectLaoId;
