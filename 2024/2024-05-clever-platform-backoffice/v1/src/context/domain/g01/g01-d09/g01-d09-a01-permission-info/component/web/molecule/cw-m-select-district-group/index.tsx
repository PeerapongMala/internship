import CWSelect from '@component/web/cw-select';
import { districtZonesList } from '@domain/g01/g01-d02/local/helper/doe-location';

type SelectDistrictGroupProps = {
  value?: string;
  onChange: (districtGroup: string) => void;
  disabled?: boolean
};
const SelectDistrictGroup = ({ value, onChange, disabled }: SelectDistrictGroupProps) => {
  return (
    <CWSelect
      title="กลุ่มเขต"
      className="w-full max-w-[265px]"
      value={value}
      options={districtZonesList.map((districtGroup) => ({
        label: districtGroup,
        value: districtGroup,
      }))}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default SelectDistrictGroup;
