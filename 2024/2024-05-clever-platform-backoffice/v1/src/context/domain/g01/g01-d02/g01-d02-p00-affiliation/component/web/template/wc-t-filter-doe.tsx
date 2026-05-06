import { AffiliationFilterQueryParams } from '@domain/g01/g01-d02/local/api/repository/affiliation';
import {
  districtZonesList,
  getDistrictsByDistrictZone,
} from '@domain/g01/g01-d02/local/helper/doe-location';
import { AffiliationGroupType } from '@domain/g01/g01-d02/local/type';
import { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

interface FilterSearchDOEProps {
  filter: AffiliationFilterQueryParams;
  setFilter: Dispatch<SetStateAction<AffiliationFilterQueryParams>>;
}

function FilterSearchDOE({ filter, setFilter }: FilterSearchDOEProps) {
  if (filter.school_affiliation_group === AffiliationGroupType.DOE) {
    const districtZone = districtZonesList.map((zone) => {
      return { label: zone, value: zone };
    });
    const districts = filter?.district_zone
      ? (getDistrictsByDistrictZone(filter.district_zone)?.map((zone) => {
          return { label: zone, value: zone };
        }) ?? [])
      : [];
    return (
      <>
        <Select
          className="w-fit lg:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={districtZone}
          value={
            filter.district_zone
              ? {
                  label: filter.district_zone,
                  value: filter.district_zone,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                district_zone: newValue?.value,
              };
            });
          }}
          placeholder={'เขตตรวจ'}
          isClearable
        />
        <Select
          className="w-fit lg:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={districts}
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
          placeholder="เขตพื้นที่"
          isClearable
        />
        <Select
          className="w-fit lg:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={[
            { label: 'รัฐ', value: 'รัฐ' },
            { label: 'เอกชน', value: 'เอกชน' },
          ]}
          value={
            filter.type
              ? {
                  label: filter.type,
                  value: filter.type,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                type: newValue?.value,
              };
            });
          }}
          placeholder="ประเภท"
          isClearable
        />
      </>
    );
  }
}

export default FilterSearchDOE;
