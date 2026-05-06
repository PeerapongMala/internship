import InputRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-input-register';
import SelectRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-select-register';
import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';

interface AffiliationOPECContentProps {
  register: UseFormRegister<Partial<Affiliation>>;
  watch: UseFormWatch<Partial<Affiliation>>;
}

export default function AffiliationOPECContent({
  register,
  watch,
}: AffiliationOPECContentProps) {
  // opec = สช.
  const currentType = watch('type');
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
      <div>
        <label htmlFor="type-select" className="before:text-red-500 before:content-['*']">
          ประเภท
        </label>
        <SelectRegister
          id="type-select"
          register={register('type', { required: true })}
          selectedValue={currentType}
          options={[
            { label: 'รัฐ', value: 'รัฐ' },
            { label: 'เอกชน', value: 'เอกชน' },
          ]}
          placeholder="ประเภท"
        />
      </div>
    </>
  );
}
