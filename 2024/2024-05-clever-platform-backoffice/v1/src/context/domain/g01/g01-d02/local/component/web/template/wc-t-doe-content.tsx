import SelectRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-select-register';
import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import {
  districtZonesList,
  getDistrictsByDistrictZone,
} from '../../../helper/doe-location';
import InputRegister from '../molecule/wc-m-input-register';

interface AffiliationDOEContentProps {
  register: UseFormRegister<Partial<Affiliation>>;
  watch: UseFormWatch<Partial<Affiliation>>;
}

// million-ignore
export default function AffiliationDOEContent({
  register,
  watch,
}: AffiliationDOEContentProps) {
  // doe = สนศ. กทม.
  const currentDistrictZone = watch('district_zone');
  const currentDistrict = watch('district');
  const districtZoneOptions = districtZonesList.map((record) => {
    return { label: record, value: record };
  });
  const districtOptions = currentDistrictZone
    ? (getDistrictsByDistrictZone(currentDistrictZone)?.map((record) => {
        return { label: record, value: record };
      }) ?? [])
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="lg:col-span-2">
          <label
            htmlFor="name-input"
            className="before:text-red-500 before:content-['*']"
          >
            ชื่อสังกัด
          </label>
          <InputRegister
            id="name-input"
            type="text"
            placeholder="ชื่อสังกัด"
            register={register('name', { required: true })}
          />
        </div>
        <div>
          <label
            htmlFor="short-name-input"
            className="before:text-red-500 before:content-['*']"
          >
            ตัวย่อ
          </label>
          <InputRegister
            id="short-name-input"
            type="text"
            placeholder="ตัวย่อ"
            register={register('short_name', { required: true })}
          />
        </div>
      </div>
      {/** second row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="district-zone-select"
            className="before:text-red-500 before:content-['*']"
          >
            เขตตรวจ:
          </label>
          <SelectRegister
            id="district-zone-select"
            register={register('district_zone', { required: true })}
            selectedValue={currentDistrictZone}
            options={districtZoneOptions}
            placeholder="เขตตรวจ"
          />
        </div>
        <div>
          <label
            htmlFor="district-select"
            className="before:text-red-500 before:content-['*']"
          >
            เขตพื้นที่:
          </label>
          <SelectRegister
            id="district-select"
            register={register('district', { required: true })}
            selectedValue={currentDistrict}
            options={districtOptions}
            placeholder="เขตพื้นที่"
          />
        </div>
        <div>
          <label className="before:text-red-500 before:content-['*']">ประเภท</label>
          <SelectRegister
            id="type-select"
            register={register('type', { required: true })}
            selectedValue={watch('type')}
            options={[
              { label: 'รัฐ', value: 'รัฐ' },
              { label: 'เอกชน', value: 'เอกชน' },
            ]}
            placeholder="ประเภท"
          />
        </div>
      </div>
    </>
  );
}
