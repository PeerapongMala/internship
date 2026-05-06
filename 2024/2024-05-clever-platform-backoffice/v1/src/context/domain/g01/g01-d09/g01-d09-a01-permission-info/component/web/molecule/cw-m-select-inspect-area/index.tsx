import CWSelect from '@component/web/cw-select';
import { inspectionAreaList } from '@domain/g01/g01-d02/local/helper/obec-location';

type SelectInspectAreaProps = {
  value?: string;
  onChange?: (inspectArea: string) => void;
};
const SelectInspectArea = ({ value, onChange }: SelectInspectAreaProps) => {
  return (
    <CWSelect
      title="เขตตรวจ"
      className="w-full max-w-[265px]"
      value={value}
      options={inspectionAreaList.map((inspectArea) => inspectArea)}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
    />
  );
};

export default SelectInspectArea;
