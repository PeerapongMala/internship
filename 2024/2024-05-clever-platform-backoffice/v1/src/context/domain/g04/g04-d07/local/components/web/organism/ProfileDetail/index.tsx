import CWInput from '@component/web/cw-input';
import CWWhiteBox from '@component/web/cw-white-box';
import { IUpdateProfileReq } from '@domain/g04/g04-d07/local/api/repository/profile';
import { useEffect, useState } from 'react';

interface ProfileDatail {
  imageUrl: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (key: keyof IUpdateProfileReq, value: string | File) => void;
  role?: string;
}

const index = ({
  imageUrl,
  title = 'คำนำหน้า',
  firstName = 'ชื่อจริง',
  lastName = 'นามสกุล',
  email = 'อีเมล',
  handleImageChange,
  handleInputChange,
  role = 'Admin',
}: ProfileDatail) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <CWWhiteBox className="flex h-fit min-h-[407px] w-full flex-1 flex-col gap-6">
      <div className="flex h-[56px] w-full items-center">
        <p className="flex text-[18px] font-bold leading-7 text-[#0E1726]">
          ผู้ใช้งานทั่วไป
        </p>
      </div>
      <div className="flex w-full gap-6">
        <div className="flex min-h-[235px] w-[235px] min-w-[235px] flex-col items-center gap-[10px]">
          <div className="size-60 overflow-hidden rounded-full bg-gray-400">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-500">
                ไม่มีรูป
              </div>
            )}
          </div>
          <label
            htmlFor="upload-button"
            className="btn btn-outline-primary hover:cursor-pointer"
          >
            อัพโหลดรูป
          </label>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageChange(e);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            className="hidden"
          />
          <div className="text-center text-sm text-neutral-400">
            <p>ขนาดแนะนำ</p>
            <p>60x60</p>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-2">
          <CWInput
            label={'ตำแหน่ง:'}
            required
            disabled
            className="w-1/3 pr-4"
            // value={data[0]?.role}
            value={role}
          />
          <div className="flex w-full items-center gap-6">
            <CWInput
              label={'คำนำหน้า:'}
              required
              className="w-1/3"
              value={title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <CWInput
              label={'ชื่อ:'}
              required
              className="w-1/3"
              value={firstName}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
            />
            <CWInput
              label={'นามสกุล:'}
              required
              className="w-1/3"
              value={lastName}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
            />
          </div>
          <CWInput label="อีเมล" required className="w-1/3 pr-4" value={email} disabled />
        </div>
      </div>
    </CWWhiteBox>
  );
};

export default index;
