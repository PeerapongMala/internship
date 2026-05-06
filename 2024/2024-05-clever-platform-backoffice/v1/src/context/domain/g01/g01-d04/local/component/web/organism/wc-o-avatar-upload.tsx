import showMessage from '@global/utils/showMessage';
import { Avatar } from '@mantine/core';
import React from 'react';

interface AvatarUploadProps {
  src?: string;
  onFileChange?: (file?: File) => void;
  maxSize?: number;
}

function AvatarUpload({
  src,
  onFileChange,
  maxSize = 5 * 1024 * 1024,
}: AvatarUploadProps) {
  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = evt.target?.files;

    if (fileList?.length === 1) {
      const file = fileList[0];

      if (file.size > maxSize) {
        showMessage('ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
        if (onFileChange) onFileChange(undefined);
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
        if (onFileChange) onFileChange(undefined);
        return;
      }
      if (onFileChange) onFileChange(file);
    } else {
      if (onFileChange) onFileChange(undefined);
    }
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar size={180} src={src} />
      <label
        htmlFor="avatar-upload"
        className="flex h-[38px] w-full max-w-[235px] cursor-pointer items-center justify-center rounded border border-primary text-sm font-bold text-primary"
      >
        <div>อัพโหลดรูป</div>
      </label>
      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center">
        <p className="text-sm leading-5 text-neutral-400">อัปโหลดรูป</p>
        <p className="text-sm leading-5 text-neutral-400">
          format: .jpg, .png | อัปโหลดรูป 5 MB
        </p>
      </div>
    </div>
  );
}

export default AvatarUpload;
