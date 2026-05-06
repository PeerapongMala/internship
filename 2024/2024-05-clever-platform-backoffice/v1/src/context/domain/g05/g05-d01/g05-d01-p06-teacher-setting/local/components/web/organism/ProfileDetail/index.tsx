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

const Index = ({
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
    <CWWhiteBox className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 xl:flex-row">
      <div className="flex flex-col items-center gap-3 xl:items-start">
        <div className="h-60 w-60 overflow-hidden rounded-full bg-gray-400">
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

        <div className="mt-2 flex flex-col items-center gap-1">
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
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/3">
            <CWInput label="ตำแหน่ง:" required disabled value={role} />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/3">
            <CWInput
              label="คำนำหน้า:"
              required
              value={title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          <div className="w-full xl:w-1/3">
            <CWInput
              label="ชื่อ:"
              required
              value={firstName}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
            />
          </div>
          <div className="w-full xl:w-1/3">
            <CWInput
              label="นามสกุล:"
              required
              value={lastName}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/3">
            <CWInput label="อีเมล" required value={email} disabled />
          </div>
        </div>
      </div>
    </CWWhiteBox>
  );
};

export default Index;
