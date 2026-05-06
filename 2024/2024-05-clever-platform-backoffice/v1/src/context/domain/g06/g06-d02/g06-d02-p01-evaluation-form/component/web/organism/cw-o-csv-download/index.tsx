import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import useModal from '@global/utils/useModal';
import { Dayjs } from 'dayjs';
import { useState } from 'react';
import dayjs from '@global/utils/dayjs';
import showMessage from '@global/utils/showMessage';
import API from '@domain/g06/g06-d02/local/api';

type CsvDownloadProps = {
  schoolID: string;
};

const CsvDownload = ({ schoolID }: CsvDownloadProps) => {
  const { isOpen, close, open } = useModal();
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      showMessage('กรุณาใส่วันที่ให้ครบ', 'error');
      return;
    }

    let blob: Blob;
    try {
      blob = await API.Grade.CsvEvaluationFormDownload(schoolID, startDate, endDate);
    } catch (error) {
      showMessage('พบปัญหาในการดาวน์โหลดไฟล์', 'error');
      throw error;
    }

    handlePromptDownload(blob, startDate, endDate);
  };

  const handlePromptDownload = (file: Blob, startDate: Dayjs, endDate: Dayjs) => {
    const fileName = `evaluation-form-${startDate.format(
      'YYYY-MM-DD',
    )}_to_${endDate.format('YYYY-MM-DD')}.csv`;

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(file);

    // Create a hidden download link
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <>
      <button className="btn btn-primary flex gap-1" onClick={() => open()}>
        {' '}
        <IconDownload /> Download
      </button>

      <CWModalDownload
        open={isOpen}
        onClose={() => {
          close();
        }}
        onDownload={handleDownload}
        startDate={startDate?.toISOString() ?? ''}
        endDate={endDate?.toISOString() ?? ''}
        setStartDate={(date) => {
          if (date.length === 0) {
            setStartDate(undefined);
            return;
          }

          setStartDate(dayjs(date));
        }}
        setEndDate={(date) => {
          if (date.length === 0) {
            setEndDate(undefined);
            return;
          }

          setEndDate(dayjs(date));
        }}
      />
    </>
  );
};

export default CsvDownload;
