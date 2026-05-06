import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import AvatarUpload from '@domain/g01/g01-d04/local/component/web/organism/wc-o-avatar-upload';
import { UpdatedSchoolAnnouncer } from '@domain/g01/g01-d04/local/type';

interface FormAnnouncerInfoProps {
  register: UseFormRegister<Partial<UpdatedSchoolAnnouncer>>;
  control: Control<Partial<UpdatedSchoolAnnouncer>>;
}

export default function FormAnnouncerInfo({ register, control }: FormAnnouncerInfoProps) {
  return (
    <>
      <div className="panel h-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-3">
            <p className="text-lg font-bold">ข้อมูลทั่วไป</p>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <AvatarUpload
                    src={
                      value &&
                      (typeof value === 'string' ? value : URL.createObjectURL(value))
                    }
                    onFileChange={onChange}
                  />
                );
              }}
              name={'profile_image'}
            />
          </div>
          <div className="col-span-2 mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <CWSelect
                value={'ฝ่ายประชาสัมพันธ์'}
                label="ตำแหน่ง"
                options={[{ label: 'ฝ่ายประชาสัมพันธ์', value: 'ฝ่ายประชาสัมพันธ์' }]}
                required
                disabled
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CWInput
                      label="คำนำหน้า:"
                      value={value}
                      onChange={onChange}
                      placeholder="กรุณาระบุ คำนำหน้า"
                      required
                    />
                  );
                }}
                name={'title'}
              />
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CWInput
                      label={'ชื่อจริง:'}
                      value={value}
                      onChange={onChange}
                      placeholder="กรุณาระบุ ชื่อจริง"
                      required
                    />
                  );
                }}
                name={'first_name'}
              />
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CWInput
                      label={'นามสกุล:'}
                      value={value}
                      onChange={onChange}
                      placeholder="กรุณาระบุ นามสกุล"
                      required
                    />
                  );
                }}
                name={'last_name'}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CWInput
                      label="อีเมล:"
                      type="email"
                      value={value}
                      onChange={onChange}
                      placeholder="กรุณาระบุ อีเมล"
                      required
                    />
                  );
                }}
                name={'email'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
