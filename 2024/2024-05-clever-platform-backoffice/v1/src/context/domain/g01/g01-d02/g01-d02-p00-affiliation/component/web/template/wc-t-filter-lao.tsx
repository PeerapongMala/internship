import { AffiliationFilterQueryParams } from '@domain/g01/g01-d02/local/api/repository/affiliation';
import {
  useDistrictLocationByName,
  useProvinceLocation,
  useSubdistrictLocationByName,
} from '@global/utils/geolocation';
import { AffiliationGroupType } from '@domain/g01/g01-d02/local/type';
import { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

interface FilterSearchLAOProps {
  filter: AffiliationFilterQueryParams;
  setFilter: Dispatch<SetStateAction<AffiliationFilterQueryParams>>;
}

function FilterSearchLAO({ filter, setFilter }: FilterSearchLAOProps) {
  if (filter.school_affiliation_group === AffiliationGroupType.LAO) {
    const province = useProvinceLocation({});
    const provinceList = province.map((record) => {
      return { label: record.provinceNameTh, value: record.provinceNameTh };
    });
    const district = useDistrictLocationByName({
      provinceNameTH: filter.province,
    });
    const districtList = district.map((record) => {
      return { label: record.districtNameTh, value: record.districtNameTh };
    });
    const subdistrict = useSubdistrictLocationByName({
      districtNameTH: filter.district,
    });
    const subdistrictList = subdistrict.map((record) => {
      return {
        label: record.subdistrictNameTh,
        value: record.subdistrictNameTh,
      };
    });
    return (
      <>
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={[
            { label: 'อบจ', value: 'อบจ' },
            { label: 'อบต', value: 'อบต' },
            { label: 'เทศบาลนคร', value: 'เทศบาลนคร' },
            { label: 'เทศบาลตำบล', value: 'เทศบาลตำบล' },
            { label: 'เทศบาลอำเภอ', value: 'เทศบาลอำเภอ' },
          ]}
          value={
            filter.lao_type
              ? {
                  label: filter.lao_type,
                  value: filter.lao_type,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                lao_type: newValue?.value,
              };
            });
          }}
          placeholder="ประเภท"
          isClearable
        />
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={provinceList}
          value={
            filter.province
              ? {
                  label: filter.province,
                  value: filter.province,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                province: newValue?.value,
              };
            });
          }}
          placeholder="จังหวัด"
          isClearable
        />
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={districtList}
          value={
            filter.district
              ? {
                  label: filter.district,
                  value: filter.district,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                district: newValue?.value,
              };
            });
          }}
          placeholder="อำเภอ"
          isClearable
        />
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={subdistrictList}
          value={
            filter.sub_district
              ? {
                  label: filter.sub_district,
                  value: filter.sub_district,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                sub_district: newValue?.value,
              };
            });
          }}
          placeholder="ตำบล"
          isClearable
        />
      </>
    );
  }
}

export default FilterSearchLAO;
