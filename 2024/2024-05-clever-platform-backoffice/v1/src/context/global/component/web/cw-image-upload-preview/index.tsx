import IconCamera from '@core/design-system/library/vristo/source/components/Icon/IconCamera';
import IconTrash from '@core/design-system/library/vristo/source/components/Icon/IconTrash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import showMessage from '@global/utils/showMessage';

interface CWImageUploadPreviewProps {
  children?: React.ReactNode;
  value?: string | string[];
  onChange?: (imageFiles: File[] | undefined) => void;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  heigth?: string
  minHeight?: string;
  minWidth?: string;
  multiple?: boolean;
  maxFiles?: number;
  showOnlyFirst?: boolean;
  labelFontBold?: boolean;
}

const CWImageUploadPreview = ({
  value,
  onChange,
  onDelete,
  disabled,
  children,
  className,
  label,
  heigth = '200px',
  minHeight = '200px',
  minWidth = '200px',
  multiple = false,
  maxFiles = 10,
  showOnlyFirst = true,
  labelFontBold = false,
}: CWImageUploadPreviewProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageURIs, setImageURIs] = useState<string[]>([]);

  useEffect(() => {
    onChange?.(imageFiles.length > 0 ? imageFiles : undefined);
  }, [imageFiles]);

  useEffect(() => {
    // Initialize with value prop if provided
    if (value) {
      if (Array.isArray(value)) {
        setImageURIs(value);
      } else {
        setImageURIs([value]);
      }
    }
  }, [value]);

  const displayURIs = useMemo(() => {
    return showOnlyFirst && imageURIs.length > 0 ? [imageURIs[0]] : imageURIs;
  }, [imageURIs, showOnlyFirst]);

  const hideImageText = useMemo<boolean>(() => {
    return disabled || imageFiles.length > 0 || (value && value.length > 0) || imageURIs.length > 0;
  }, [imageFiles, value, imageURIs, disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if we're exceeding max files
    if (multiple && imageFiles.length + files.length > maxFiles) {
      showMessage(`คุณสามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`, 'warning');
      return;
    }

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(file.name);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(file.name);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      showMessage(`ไฟล์ต่อไปนี้ไม่ตรงตามข้อกำหนด: ${invalidFiles.join(', ')}`, 'warning');
    }

    if (validFiles.length > 0) {
      const newURIs = validFiles.map(file => URL.createObjectURL(file));

      if (multiple) {
        setImageFiles(prev => [...prev, ...validFiles]);
        setImageURIs(prev => [...prev, ...newURIs]);
      } else {
        setImageFiles([validFiles[0]]);
        setImageURIs([newURIs[0]]);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageURIs(prev => {
      const newURIs = [...prev];
      URL.revokeObjectURL(newURIs[index]);
      newURIs.splice(index, 1);
      return newURIs;
    });
    if (onDelete && imageURIs.length === 1) {
      onDelete();
    }
  };

  const removeAllImages = () => {
    imageURIs.forEach(uri => URL.revokeObjectURL(uri));
    setImageFiles([]);
    setImageURIs([]);
    if (onDelete) {
      onDelete();
    }
  };

  const removeSpecificImage = (index: number) => {
    removeImage(index);
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      {label && (
        <h1 className={`text-base ${labelFontBold ? 'font-bold' : ''}`}>{label}</h1>
      )}
      <div
        className={` relative flex justify-center items-center w-full min-h-[250px] h-${heigth} cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 ${className ?? ''}`}
        style={{ minHeight: minHeight, minWidth: minWidth }}
        onClick={() => !disabled && inputRef?.current?.click()}
      >
        {displayURIs.length > 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            {multiple && !showOnlyFirst ? (
              <div className="grid grid-cols-2 gap-4 w-full h-full overflow-auto">
                {displayURIs.map((uri, index) => (
                  <div key={index} className="relative group flex items-center justify-center">
                    <img
                      src={uri}
                      alt={`uploaded preview ${index + 1}`}
                      className="h-auto max-w-full max-h-full object-contain rounded-md"
                    />
                    {!disabled && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSpecificImage(index);
                        }}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative group flex items-center justify-center h-full w-full">
                <img
                  src={displayURIs[0]}
                  alt="uploaded preview"
                  className="max-h-full max-w-full object-contain rounded-md"
                />
                {!disabled && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSpecificImage(0);
                    }}
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-dark">
            <IconCamera duotone={false} className="h-12 w-12" />
            <div className="text-center">
              {children ?? (
                <>
                  <div className='flex justify-center underline'>อัปโหลดรูป</div>
                  <div>format: .jpg, .png | อัปโหลดรูป 5 MB {multiple ? `| สูงสุด ${maxFiles} รูป` : ''}</div>
                </>
              )}
            </div>
          </div>
        )}

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          disabled={disabled}
          multiple={multiple}
        />
      </div>

      {multiple === true && imageURIs.length > 0 && !disabled && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {imageURIs.length} {multiple ? 'รูป' : 'รูป'} ที่เลือก
            {multiple && ` (สูงสุด ${maxFiles} รูป)`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="text-red-500 text-sm underline"
              onClick={removeAllImages}
            >
              ลบทั้งหมด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CWImageUploadPreview;