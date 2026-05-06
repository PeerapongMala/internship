import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import { useRef } from 'react';

type CsvUploadProps = {
  onFileChange?: (file?: File) => Promise<void>;
  onSuccess?: () => void;
};

const CsvUpload = ({ onSuccess, onFileChange }: CsvUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    await onFileChange?.(file);

    onSuccess?.();
  };

  return (
    <>
      <button className="btn btn-primary flex w-full gap-1" onClick={handleUploadClick}>
        <IconUpload /> Upload
      </button>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default CsvUpload;
