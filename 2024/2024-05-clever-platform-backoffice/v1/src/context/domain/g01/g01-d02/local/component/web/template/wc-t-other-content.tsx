import InputRegister from '@domain/g01/g01-d02/local/component/web/molecule/wc-m-input-register';
import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { UseFormRegister } from 'react-hook-form';

interface AffiliationOtherContentProps {
  register: UseFormRegister<Partial<Affiliation>>;
}

export default function AffiliationOtherContent({
  register,
}: AffiliationOtherContentProps) {
  // other = อื่นๆ
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
            placeholder="ชื่อสังกัด"
            register={register('name')}
          />
        </div>
        <div>
          <label htmlFor="short-name-input">ตัวย่อ</label>
          <InputRegister
            id="short-name-input"
            placeholder="ตัวย่อ"
            register={register('short_name')}
          />
        </div>
      </div>
    </>
  );
}
