import React, { useRef, useState } from 'react';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
  value?: string | number;
  className?: string;
  image_url?: string;
}

const InputFile = ({
  onChange,
  required,
  label,
  placeholder = 'Choose file...',
  value,
  className = '',
  disabled,
  image_url,
  ...rest
}: InputProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      onChange && onChange(e);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {/* if label is string */}
        {typeof label === 'string' && (
          <div className="my-2 text-base">
            {required && <span className="text-red-500">* </span>}
            {label}:
          </div>
        )}

        {/* if label is react node */}
        {label && typeof label !== 'string' && (
          <div className="my-2 flex">
            {required && <span className="text-red-500">* </span>}
            {label}
          </div>
        )}

        {image_url && (
          <div className="relative">
            <div
              onMouseEnter={() => setShowImage(true)}
              onMouseLeave={() => setShowImage(false)}
              className="cursor-pointer"
            >
              <IconEye className="h-5 w-5" />
            </div>
            <div
              className={cn(
                'absolute left-36 top-0 z-10 flex h-full w-full items-center justify-center bg-white bg-opacity-90 transition-opacity duration-300',
                showImage ? 'opacity-100' : 'opacity-0',
              )}
            >
              <img
                src={image_url}
                alt="Image"
                className="h-auto max-w-52 border-2 bg-white"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <input
          id="ctnFile"
          type="file"
          className="w-0"
          required={required}
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInput}
          value={value}
          disabled={disabled}
          {...rest}
        />
        <div
          className="form-input cursor-pointer !rounded-r-none !font-normal"
          onClick={() => fileInput.current?.click()}
        >
          {file ? file.name : <div className="text-gray-500">{placeholder}</div>}
        </div>
        <div
          className="flex cursor-pointer items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:!rounded-r-md ltr:border-l-0 rtl:!rounded-l-md rtl:border-r-0 dark:border-[#17263c] dark:bg-[#1b2e4b]"
          onClick={() => fileInput.current?.click()}
        >
          <IconUpload className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default InputFile;
