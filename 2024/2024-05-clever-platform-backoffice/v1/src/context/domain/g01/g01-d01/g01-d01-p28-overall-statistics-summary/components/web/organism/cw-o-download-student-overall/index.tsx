import useModal from '@global/utils/useModal';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/vristo/source/components/Icon/IconDownload';
import ModalDownloadCustomKey from '../../molecules/cw-m-modal-download-custom-key';
import TitleDownloadModal from '../../atom/cw-a-title-modal';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d01/local/api';
import { downloadStringAsFile } from '@domain/g01/g01-d01/local/utils/download-csv';
import showMessage from '@global/utils/showMessage';
import { formatToDate } from '@global/utils/format/date';

type DownloadStudentOverallProps = {
  type: 'level' | 'star';
};
const DownloadStudentOverall = ({ type }: DownloadStudentOverallProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const modal = useModal();

  useEffect(() => {
    if (modal.isOpen) {
      setStartDate('');
      setEndDate('');
    }
  }, [modal.isOpen]);

  const handleDownload = async (cols: number[]) => {
    try {
      const raw = await API.progressDashboard.GetBestStudentCSV({
        columns: cols.join(','),
        start_date: startDate ? startDate : undefined,
        end_date: endDate ? endDate : undefined,
        order_by: type == 'level' ? 1 : 2,
        limit: -1,
      });

      const dateString = [startDate, endDate]
        .filter((d) => !!d)
        .map((date) => formatToDate(date, { format: 'YYYY-MM-DD' }))
        .join('_');

      downloadStringAsFile(
        raw,
        `report_overall_statistics-best-teacher-by-class-star-${dateString ? `${dateString}` : formatToDate(new Date(), { format: 'YYYY-MM-DD' })}`,
      );
    } catch (error) {
      showMessage((error as Error).message, 'error');
    }

    modal.close();
  };

  return (
    <div className="flex flex-col gap-3">
      <span>
        สรุปการจัดอันดับจํานวน{type == 'level' ? 'ด่าน' : 'ดาว'}สูงสุด จากทุกโรงเรียน
      </span>

      <CWButton
        className="w-fit"
        icon={<IconDownload />}
        title="Download"
        onClick={() => {
          modal.open();
        }}
      />

      <ModalDownloadCustomKey
        title={
          <TitleDownloadModal description="สรุปการจัดอันดับจํานวนดาวสูงสุด จากทุกโรงเรียน" />
        }
        open={modal.isOpen}
        onOk={(params) => {
          handleDownload(params.map((p) => p.value));
        }}
        onClose={() => {
          modal.close();
        }}
        params={[
          { label: 'ชื่อโรงเรียน', key: 'school_name', value: 0 },
          { label: 'ชื่อนักเรียน', key: 'student_name', value: 1 },
          { label: 'ชั้นปี', key: 'year', value: 2 },
          { label: 'ห้องเรียน', key: 'school_room', value: 3 },
          {
            label: `จํานวน ${type == 'level' ? 'ด่าน' : 'คะแนน (ดาว)'} ที่ได้`,
            key: 'star',
            value: 4,
          },
        ]}
      >
        <WCAInputDateFlat
          value={[startDate, endDate]}
          options={{
            mode: 'range',
            dateFormat: 'd/m/Y',
          }}
          onChange={(date) => {
            if (date.length >= 1) setStartDate(date[0].toISOString());
            if (date.length == 2) setEndDate(date[1].toISOString());
          }}
        />
      </ModalDownloadCustomKey>
    </div>
  );
};

export default DownloadStudentOverall;
