import InputRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-input-register';
import SelectRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-select-register';
import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { useEffect } from 'react';
import { UseFormRegister, UseFormResetField, UseFormWatch } from 'react-hook-form';
import {
  useDistrictLocationByName,
  useProvinceLocation,
  useSubdistrictLocationByName,
} from '@global/utils/geolocation';

interface AffiliationLAOContentProps {
  register: UseFormRegister<Partial<Affiliation>>;
  watch: UseFormWatch<Partial<Affiliation>>;
  resetField: UseFormResetField<Partial<Affiliation>>;
}

export default function AffiliationLAOContent({
  register,
  watch,
  resetField,
}: AffiliationLAOContentProps) {
  // lao = อปท.
  const laoType = watch('lao_type');
  useEffect(() => {
    resetField('district');
    resetField('sub_district');
  }, [laoType]);

  const selectedLAOType = watch('lao_type');
  const selectedProvince = watch('province');
  const selectedDistrict = watch('district');
  const selectedSubdistricts = watch('sub_district');
  const provinces = useProvinceLocation({});
  const districts = useDistrictLocationByName({
    provinceNameTH: selectedProvince,
  });
  const subdistricts = useSubdistrictLocationByName({
    districtNameTH: selectedDistrict,
  });

  function renderRegionLAOType() {
    const includeDistrict =
      laoType && ['เทศบาลอำเภอ', 'เทศบาลตำบล', 'อบต'].includes(laoType);
    const includeSubDistrict = laoType && ['เทศบาลตำบล', 'อบต'].includes(laoType);

    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="province-select"
            className="before:text-red-500 before:content-['*']"
          >
            จังหวัด
          </label>
          <SelectRegister
            id="province-select"
            register={register('province', {
              required: true,
              disabled: !selectedLAOType,
            })}
            selectedValue={selectedProvince}
            options={provinces.map((province) => {
              return {
                label: province.provinceNameTh,
                value: province.provinceNameTh,
              };
            })}
          />
        </div>

        {includeDistrict && (
          <div>
            <label
              htmlFor="district-select"
              className="before:text-red-500 before:content-['*']"
            >
              อำเภอ
            </label>
            <SelectRegister
              id="district-select"
              register={register('district', {
                required: true,
                disabled: !selectedProvince,
              })}
              selectedValue={selectedDistrict}
              options={districts.map((district) => {
                return {
                  label: district.districtNameTh,
                  value: district.districtNameTh,
                };
              })}
              placeholder="อำเภอ"
            />
          </div>
        )}

        {includeSubDistrict && (
          <div>
            <label
              htmlFor="subdistrict-select"
              className="before:text-red-500 before:content-['*']"
            >
              ตำบล
            </label>
            <SelectRegister
              id="subdistrict-select"
              register={register('sub_district', {
                required: true,
                disabled: !selectedDistrict,
              })}
              selectedValue={selectedSubdistricts}
              options={subdistricts.map((subdistrict) => {
                return {
                  label: subdistrict.subdistrictNameTh,
                  value: subdistrict.subdistrictNameTh,
                };
              })}
              placeholder="ตำบล"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/** second row */}
      <div>
        <label
          htmlFor="lao-type-select"
          className="before:text-red-500 before:content-['*']"
        >
          ประเภท
        </label>
        <SelectRegister
          id="lao-type-select"
          className="max-w-sm"
          register={register('lao_type', { required: true })}
          selectedValue={selectedLAOType}
          options={[
            { label: 'อบจ', value: 'อบจ' },
            { label: 'อบต', value: 'อบต' },
            { label: 'เทศบาลนคร', value: 'เทศบาลนคร' },
            { label: 'เทศบาลตำบล', value: 'เทศบาลตำบล' },
            { label: 'เทศบาลอำเภอ', value: 'เทศบาลอำเภอ' },
          ]}
          placeholder="ประเภท"
        />
      </div>

      {/** third row */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="lg:col-span-2">
          <label
            htmlFor="name-input"
            className="before:text-red-500 before:content-['*']"
          >
            ชื่อ (อบจ/อบต/เทศบาล)
          </label>
          <InputRegister
            id="name-input"
            placeholder="ชื่อ"
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
            placeholder="ตัวย่อ"
            register={register('short_name', { required: true })}
          />
        </div>
      </div>

      {/** fourth row */}
      {renderRegionLAOType()}
    </>
  );
}
