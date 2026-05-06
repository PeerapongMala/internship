import IconCamera from '@core/design-system/library/vristo/source/components/Icon/IconCamera';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ConfigJson from '../../../../local/config/index.json';
import { useTranslation } from 'react-i18next';

interface CWImageUploadPreviewProps {
  children?: React.ReactNode;
  value?: string;
  onChange?: (imageFile: File | undefined) => void;
  disabled?: boolean;
}

const CWImageUploadPreview: React.FC<CWImageUploadPreviewProps> = ({
  value,
  ...props
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | undefined>();

  useEffect(() => {
    props.onChange?.(imageFile);
  }, [imageFile]);

  const hideImageText = useMemo<boolean>(() => {
    return !!props.disabled || !!imageFile || !!(value && value.trim() !== '');
  }, [imageFile, value, props.disabled]);

  return (
    <button
      type="button"
      className="flex h-80 w-80 items-center justify-center border-2 border-dotted bg-cover bg-center"
      onClick={() => inputRef?.current?.click()}
      disabled={props.disabled}
      style={{
        backgroundImage: imageFile
          ? `url(${URL.createObjectURL(imageFile)})`
          : value
            ? `url(${value})`
            : '',
      }}
    >
      {!hideImageText && (
        <div className="text-dark">
          <div className="flex justify-center">
            <IconCamera duotone={false} className="h-12 w-12" />
          </div>
          <div>
            {props.children ?? (
              <div>
                <div>อัปโหลดรูป</div>
                <div>format: .jpg, .png | อัปโหลดรูป XX MB</div>
              </div>
            )}
          </div>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          setImageFile(e.currentTarget.files?.[0]);
        }}
      />
    </button>
  );
};

export default CWImageUploadPreview;
