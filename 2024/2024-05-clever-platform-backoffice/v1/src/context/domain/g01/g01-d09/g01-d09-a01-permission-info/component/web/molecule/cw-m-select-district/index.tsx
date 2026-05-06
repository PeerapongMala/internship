import CWSelect from '@component/web/cw-select';
import { getDistrictsByDistrictZone } from '@domain/g01/g01-d02/local/helper/doe-location';

type SelectDistrictProps = {
  districtGroup?: string;
  value?: string;
  onChange: (district: string) => void;
  disabled?: boolean
};
const SelectDistrict = ({ districtGroup, value, onChange, disabled }: SelectDistrictProps) => {
  return (
    <CWSelect
      title="เขต"
      className="w-full max-w-[265px]"
      value={value}
      options={getDistrictsByDistrictZone(districtGroup ?? '')?.map((district) => ({
        label: district,
        value: district,
      }))}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
};

export default SelectDistrict;
