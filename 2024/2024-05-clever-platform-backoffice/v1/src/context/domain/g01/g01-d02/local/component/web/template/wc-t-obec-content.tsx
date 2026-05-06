//million-ignore
import SelectRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-select-register';
import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import {
  getAreaOfficeByInspectionArea,
  inspectionAreaList,
} from '../../../helper/obec-location';
import InputRegister from '../molecule/wc-m-input-register';

interface AffiliationOBECContentProps {
  register: UseFormRegister<Partial<Affiliation>>;
  watch: UseFormWatch<Partial<Affiliation>>;
}

export default function AffiliationOBECContent({
  register,
  watch,
}: AffiliationOBECContentProps) {
  // obec = สพฐ
  const currentInspectionArea = watch('inspection_area');
  const currentAreaOffice = watch('area_office');
  const currentType = watch('type');
  const inspectionAreasOption = inspectionAreaList;
  const areaOfficesOption =
    getAreaOfficeByInspectionArea(currentInspectionArea ?? '')?.map((record) => {
      return { label: record, value: record };
    }) ?? [];
  return (
    <>
      {/** second row */}
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

      {/** third row */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label
            htmlFor="inspection-area-select"
            className="before:text-red-500 before:content-['*']"
          >
            เขต:
          </label>
          <SelectRegister
            id="inspection-area-select"
            register={register('inspection_area', { required: true })}
            selectedValue={currentInspectionArea}
            options={inspectionAreasOption}
            placeholder="เขต"
          />
        </div>
        <div>
          <label
            htmlFor="area-office-select"
            className="before:text-red-500 before:content-['*']"
          >
            พื้นที่:
          </label>
          <SelectRegister
            id="area-office-select"
            register={register('area_office', { required: true })}
            selectedValue={currentAreaOffice}
            options={areaOfficesOption}
            placeholder="พื้นที่"
          />
        </div>
        <div>
          <label
            htmlFor="type-select"
            className="before:text-red-500 before:content-['*']"
          >
            ประเภท
          </label>
          <SelectRegister
            id="type-select"
            register={register('type', { required: true })}
            options={[
              { label: 'รัฐ', value: 'รัฐ' },
              { label: 'เอกชน', value: 'เอกชน' },
            ]}
            selectedValue={currentType}
            placeholder="ประเภท"
          />
        </div>
      </div>
    </>
  );
}
