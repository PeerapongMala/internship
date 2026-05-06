import { AffiliationFilterQueryParams } from '@domain/g01/g01-d02/local/api/repository/affiliation';
import {
  getAreaOfficeByInspectionArea,
  inspectionAreaList,
} from '@domain/g01/g01-d02/local/helper/obec-location';

import { AffiliationGroupType } from '@domain/g01/g01-d02/local/type';
import { Dispatch, SetStateAction, useState } from 'react';
import Select from 'react-select';

interface FilterSearchOBECProps {
  filter: AffiliationFilterQueryParams;
  setFilter: Dispatch<SetStateAction<AffiliationFilterQueryParams>>;
}

function FilterSearchOBEC({ filter, setFilter }: FilterSearchOBECProps) {
  const [selectedInspectionArea, setSelectedInspectionArea] = useState<{
    label: string;
    value: string;
  }>();

  if (filter.school_affiliation_group === AffiliationGroupType.OBEC) {
    const inspectionAreasOption = inspectionAreaList;
    const areaOfficesOption =
      getAreaOfficeByInspectionArea(filter?.inspection_area ?? '')?.map((record) => {
        return { label: record, value: record };
      }) ?? [];
    return (
      <>
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={inspectionAreasOption}
          value={selectedInspectionArea}
          onChange={(newValue) => {
            setSelectedInspectionArea(
              newValue ? { label: newValue?.label, value: newValue?.value } : undefined,
            );
            setFilter((prev) => {
              return {
                ...prev,
                inspection_area: newValue?.value,
              };
            });
          }}
          placeholder="เขตตรวจราชการ"
          isClearable
        />
        <Select
          className="w-fit md:min-w-[150px] xl:md:min-w-[200px]"
          classNames={{
            menu: (props) => {
              return '!z-[3]';
            },
          }}
          options={areaOfficesOption}
          value={
            filter.area_office
              ? {
                  label: filter.area_office,
                  value: filter.area_office,
                }
              : undefined
          }
          onChange={(newValue) => {
            setFilter((prev) => {
              return {
                ...prev,
                area_office: newValue?.value,
              };
            });
          }}
          placeholder="พื้นที่"
          isClearable
        />
      </>
    );
  }
}

export default FilterSearchOBEC;
