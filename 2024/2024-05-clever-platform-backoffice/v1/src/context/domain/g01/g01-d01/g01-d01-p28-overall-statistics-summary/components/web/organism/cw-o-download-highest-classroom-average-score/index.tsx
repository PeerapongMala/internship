import useModal from '@global/utils/useModal';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/vristo/source/components/Icon/IconDownload';
import ModalDownloadCustomKey from '../../molecules/cw-m-modal-download-custom-key';
import TitleDownloadModal from '../../atom/cw-a-title-modal';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d01/local/api';
import { downloadStringAsFile } from '@domain/g01/g01-d01/local/utils/download-csv';
import CWInput from '@component/web/cw-input';
import showMessage from '@global/utils/showMessage';
import { formatToDate } from '@global/utils/format/date';

const DownloadHighestClassroomAvgScore = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [subjectName, setSubjectName] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  const modal = useModal();

  useEffect(() => {
    if (modal.isOpen) {
      setStartDate('');
      setEndDate('');
    }
  }, [modal.isOpen]);

  const handleDownload = async (cols: number[]) => {
    try {
      const raw = await API.progressDashboard.GetBestTeacherListByLesson({
        columns: cols.join(','),
        start_date: startDate ? startDate : undefined,
        end_date: endDate ? endDate : undefined,
        limit: -1,
        academic_year: academicYear,
        subject_name: subjectName,
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
      <span>สรุปบทเรียน</span>

      <CWButton
        className="w-fit"
        icon={<IconDownload />}
        title="Download"
        onClick={() => {
          modal.open();
        }}
      />

      <ModalDownloadCustomKey
        title={<TitleDownloadModal description="สรุปสถานะการบ้าน" />}
        open={modal.isOpen}
        onOk={(params) => {
          handleDownload(params.map((p) => p.value));
        }}
        onClose={() => {
          modal.close();
        }}
        params={[
          { label: 'สังกัดวิชา', key: 'subject_group', value: 0 },
          { label: 'ระดับชั้น', key: 'class_level', value: 1 },
          { label: 'บทเรียนหลัก', key: 'main_lesson', value: 2 },
          { label: 'บทเรียนย่อย', key: 'sub_lesson', value: 3 },
          { label: 'คะแนนรวมโดยเฉลี่ย (ดาว)', key: 'avg_score_star', value: 4 },
          { label: 'ด่านที่ผ่านโดยเฉลี่ย', key: 'avg_passed_stage', value: 5 },
          { label: 'ทำแบบฝึกหัด (ครั้ง)', key: 'exercise_count', value: 6 },
          { label: 'เวลาเฉลี่ยต่อข้อ', key: 'avg_time_per_question', value: 7 },
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

        <CWInput
          placeholder="ปีการศึกษา"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        />

        <CWInput
          placeholder="วิชา"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
      </ModalDownloadCustomKey>
    </div>
  );
};

export default DownloadHighestClassroomAvgScore;
