import { ChangeEvent, InputHTMLAttributes, useRef } from 'react';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import CWButton from '@component/web/cw-button';

type UploadButtonProps = InputHTMLAttributes<HTMLInputElement> & {
  onFileChange?: (file: File) => void;
};

const UploadButton = ({ onFileChange }: UploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget?.files?.[0];
    if (file) {
      onFileChange?.(file);

      // Reset the file input after processing
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv"
        onChange={handleInputChange}
      />
      <CWButton title="Upload" icon={<IconUpload />} onClick={handleClick} />
    </>
  );
};

export default UploadButton;
