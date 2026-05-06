import IconCamera from '@core/design-system/library/vristo/source/components/Icon/IconCamera';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ConfigJson from '../../../../local/config/index.json';
import { useTranslation } from 'react-i18next';
import showMessage from '@global/utils/showMessage';

interface CWImageUploadPreviewProps {
  children?: React.ReactNode;
  value?: string;
  onChange?: (imageFile: File | undefined) => void;
  disabled?: boolean;
  className?: string;
}

const CWImageUploadPreview: React.FC<CWImageUploadPreviewProps> = ({
  value,
  onChange,
  disabled,
  children,
  className,
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imageURI, setImageURI] = useState('');

  useEffect(() => {
    onChange?.(imageFile);
  }, [imageFile]);

  const hideImageText = useMemo<boolean>(() => {
    return disabled || imageFile !== undefined || value !== '' || imageURI !== '';
  }, [imageFile, value, imageURI, disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
      return;
    }

    setImageURI(URL.createObjectURL(file));
    setImageFile(file);
  };

  return (
    <div
      className={`relative inline-block h-[350px] w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 ${
        className ?? ''
      }`}
      style={{ minHeight: '320px', minWidth: '320px' }}
      onClick={() => !disabled && inputRef?.current?.click()}
    >
      {imageURI || value ? (
        <img
          src={imageURI || value}
          alt="uploaded preview"
          className="h-auto max-w-full"
          style={{ maxHeight: '500px' }}
        />
      ) : (
        <div className="flex h-80 w-80 flex-col items-center justify-center text-dark">
          <IconCamera duotone={false} className="h-12 w-12" />
          <div>
            {children ?? (
              <>
                <div>อัปโหลดรูป</div>
                <div>format: .jpg, .png | อัปโหลดรูป 5 MB</div>
              </>
            )}
          </div>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default CWImageUploadPreview;
