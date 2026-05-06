import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import AvatarUpload from '@domain/g01/g01-d04/local/component/web/organism/wc-o-avatar-upload';
import { IObserverAccess, IObserverInput } from '@domain/g01/g01-d04/local/type';
import { UseFormRegister, Control, useWatch, Controller } from 'react-hook-form';

interface UserProfileInfoProps {
  register: UseFormRegister<Partial<IObserverInput>>;
  control: Control<Partial<IObserverInput>>;
}

const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ register, control }) => {
  const values = useWatch({ control });

  const handleFileChange = (file?: File) => {
    if (file) {
      register('profile_image_file', {
        value: file,
        onChange: (e) => {
          register('profile_path', {
            value: URL.createObjectURL(file),
          });
        },
      });
    }
  };

  return (
    <>
      <div className="panel h-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-3">
            {/* General Information Section */}
            <p className="text-lg font-bold">ข้อมูลทั่วไป</p>
            <AvatarUpload src={values.profile_path} onFileChange={handleFileChange} />
          </div>

          {/* Form Section */}
          <div className="col-span-2 mt-6 flex flex-col gap-4">
            {/* Observer Access Select */}
            <div className="grid grid-cols-3 gap-4">
              <CWSelect
                label="ตำแหน่ง"
                required
                disabled
                className="w-full"
                value={'ผู้สังเกตการณ์'}
                options={[{ label: 'ผู้สังเกตการณ์', value: 'ผู้สังเกตการณ์' }]}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Title Select */}
              <div className="col-span-1">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <CWInput
                      {...field}
                      title="คำนำหน้า"
                      label="คำนำหน้า"
                      placeholder="กรุณาระบุ คำนำหน้า"
                      required
                      className="w-full"
                    />
                  )}
                />
              </div>

              {/* First Name Input */}
              <div className="col-span-1">
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <CWInput
                      {...field}
                      title="ชื่อ"
                      label="ชื่อ"
                      placeholder="กรุณาระบุ ชื่อจริง"
                      required
                      className="w-full"
                    />
                  )}
                />
              </div>

              {/* Last Name Input */}
              <div className="col-span-1">
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <CWInput
                      {...field}
                      title="นามสกุล"
                      label="นามสกุล"
                      placeholder="กรุณาระบุ นามสกุล"
                      required
                      className="w-full"
                    />
                  )}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CWInput
                    {...field}
                    title="อีเมล"
                    label="อีเมล"
                    placeholder="กรุณาระบุ อีเมล"
                    required
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileInfo;
