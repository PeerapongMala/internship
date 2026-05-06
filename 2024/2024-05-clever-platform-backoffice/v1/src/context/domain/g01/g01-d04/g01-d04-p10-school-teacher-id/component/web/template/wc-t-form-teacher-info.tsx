import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWSelect from '@component/web/cw-select';
import { CreatedTeacherRecord, TeacherAccess } from '@domain/g01/g01-d04/local/type';
import { Control, Controller, UseFormRegister } from 'react-hook-form';
import AvatarUpload from '@domain/g01/g01-d04/local/component/web/organism/wc-o-avatar-upload';
import { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d04/local/api';

interface FormTeacherInfoProps {
  register: UseFormRegister<Partial<CreatedTeacherRecord>>;
  control: Control<Partial<CreatedTeacherRecord>>;
}

export default function FormTeacherInfo({ register, control }: FormTeacherInfoProps) {
  const [accessList, setAccessList] = useState<TeacherAccess[]>([]);
  // get access list
  useEffect(() => {
    API.schoolTeacher.AccessListGets().then((res) => {
      if (res.status_code === 200) {
        setAccessList(res.data);
      }
    });
  }, []);

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
              <div className="flex-1">
                <CWSelect
                  label={'ตำแหน่ง'}
                  value={'ครู'}
                  options={[{ label: 'ครู', value: 'ครู' }]}
                  disabled
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => {
                  return (
                    <CWInput
                      label={'คำนำหน้า:'}
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
      <div className="panel flex h-auto w-full flex-col gap-[20px]">
        <p className="text-lg font-bold">ความรับผิดชอบ</p>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            const handleOnChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
              const targetValue = Number(evt.target.value);
              const stack = value ?? [];
              if (stack?.includes(targetValue)) {
                onChange(stack.filter((v) => v !== targetValue));
              } else {
                onChange([...stack, targetValue]);
              }
            };
            return (
              <>
                {accessList.map((item) => {
                  return (
                    <CWInputCheckbox
                      label={item.access_name}
                      value={item.teacher_access_id}
                      checked={value?.includes(item.teacher_access_id)}
                      onChange={handleOnChange}
                      key={item.teacher_access_id}
                    />
                  );
                })}
              </>
            );
          }}
          name={'teacher_accesses'}
        />
      </div>
    </>
  );
}
