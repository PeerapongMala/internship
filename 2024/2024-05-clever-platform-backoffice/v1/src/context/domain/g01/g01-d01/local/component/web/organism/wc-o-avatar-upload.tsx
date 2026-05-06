import { Avatar } from '@mantine/core';
import React from 'react';

interface AvatarUploadProps {
  src?: string;
  onFileChange?: (file?: File) => void;
}

function AvatarUpload({ src, onFileChange }: AvatarUploadProps) {
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
        onChange={(evt) => {
          const fileList = evt.target?.files;
          if (fileList?.length === 1) {
            const file = fileList[0];
            if (onFileChange) onFileChange(file);
          } else {
            if (onFileChange) onFileChange(undefined);
          }
        }}
        className="hidden"
      />
      <div className="flex flex-col items-center">
        <p className="text-sm leading-5 text-neutral-400">ขนาดแนะนำ:</p>
        <p className="text-sm leading-5 text-neutral-400">xxxx</p>
      </div>
    </div>
  );
}

export default AvatarUpload;
