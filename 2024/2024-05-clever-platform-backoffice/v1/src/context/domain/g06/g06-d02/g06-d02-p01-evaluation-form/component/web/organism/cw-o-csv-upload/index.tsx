import { useRef } from 'react';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import API from '@domain/g06/g06-d02/local/api';
import showMessage from '@global/utils/showMessage';

type CsvUploadProps = {
  schoolID: string;
};

const CsvUpload = ({ schoolID }: CsvUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Upload file
    try {
      await API.Grade.CsvEvaluationFormUpload(schoolID, file);
    } catch (error) {
      showMessage('พบปัญหาในการนำเข้าข้อมูล', 'error');

      throw error;
    }
    showMessage('นำเข้าข้อมูลสำเร็จ');
  };

  return (
    <>
      <button className="btn btn-primary flex gap-1" onClick={handleUploadClick}>
        {' '}
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
