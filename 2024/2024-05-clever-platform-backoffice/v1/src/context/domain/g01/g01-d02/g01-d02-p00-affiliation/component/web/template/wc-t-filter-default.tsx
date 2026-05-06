import { AffiliationFilterQueryParams } from '@domain/g01/g01-d02/local/api/repository/affiliation';
import {
  districtZonesList,
  getDistrictsByDistrictZone,
} from '@domain/g01/g01-d02/local/helper/doe-location';
import { AffiliationGroupType } from '@domain/g01/g01-d02/local/type';
import { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';

interface FilterSearchDefaultProps {
  filter: AffiliationFilterQueryParams;
  setFilter: Dispatch<SetStateAction<AffiliationFilterQueryParams>>;
}

function FilterSearchDefault({ filter, setFilter }: FilterSearchDefaultProps) {
  if (
    filter.school_affiliation_group === AffiliationGroupType.OTHER ||
    filter.school_affiliation_group === AffiliationGroupType.OPEC
  )
    return (
      <>
        <Select
          className="w-fit md:min-w-[200px]"
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

export default FilterSearchDefault;
