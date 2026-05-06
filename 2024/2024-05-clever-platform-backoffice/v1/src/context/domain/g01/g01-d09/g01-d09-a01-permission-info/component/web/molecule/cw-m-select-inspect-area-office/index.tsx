import CWSelect from '@component/web/cw-select';
import { getAreaOfficeByInspectionArea } from '@domain/g01/g01-d02/local/helper/obec-location';

type SelectInspectAreaOfficeProps = {
  value?: string;
  inspectArea?: string;
  onChange?: (inspectArea: string) => void;
};
const SelectInspectAreaOffice = ({
  inspectArea,
  value,
  onChange,
}: SelectInspectAreaOfficeProps) => {
  return (
    <CWSelect
      title="เขตพื้นที่"
      className="w-full max-w-[265px]"
      value={value}
      options={getAreaOfficeByInspectionArea(inspectArea ?? '')?.map((areaOffice) => ({
        label: areaOffice,
        value: areaOffice,
      }))}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
    />
  );
};

export default SelectInspectAreaOffice;
