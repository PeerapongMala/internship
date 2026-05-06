import useModal from '@global/utils/useModal';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/vristo/source/components/Icon/IconDownload';
import ModalDownloadCustomKey from '../../molecules/cw-m-modal-download-custom-key';
import TitleDownloadModal from '../../atom/cw-a-title-modal';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d01/local/api';
import { downloadStringAsFile } from '@domain/g01/g01-d01/local/utils/download-csv';
import CWSelect from '@component/web/cw-select';
import SelectSchool from '../../molecules/cw-m-select-school';
import { TBestTeacherListByClassStarQueryParams } from '@domain/g01/g01-d01/local/api/group/progress-dashboard/restapi/type';
import showMessage from '@global/utils/showMessage';
import { formatToDate } from '@global/utils/format/date';

const DownloadClassAvgAllSchool = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [schoolValue, setSchoolValue] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [schoolAffiliationType, setSchoolAffiliationType] = useState('');

  const modal = useModal();

  useEffect(() => {
    if (modal.isOpen) {
      setStartDate('');
      setEndDate('');
    }
  }, [modal.isOpen]);

  const handleDownload = async (cols: number[]) => {
    try {
      const query: TBestTeacherListByClassStarQueryParams = {
        columns: cols.join(','),
        start_date: startDate ? startDate : undefined,
        end_date: endDate ? endDate : undefined,
        limit: -1,
        school_affiliation_type: schoolAffiliationType
          ? schoolAffiliationType
          : undefined,
      };

      if (schoolType == 'school_id') query.school_id = schoolValue;
      if (schoolType == 'school_code') query.school_code = schoolValue;
      if (schoolType == 'school_name') query.school_name = schoolValue;

      const raw = await API.progressDashboard.GetBestSchoolByAvgClassStar(query);

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
      <span>สรุปค่าเฉลี่ยคะแนนห้องเรียนสูงสุด</span>

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
          { label: 'ชื่อโรงเรียน', key: 'school_name', value: 0 },
          { label: 'ระดับชั้น (รวม)', key: 'total_class_levels', value: 1 },
          { label: 'จำนวนห้องเรียน (รวม)', key: 'total_classrooms', value: 2 },
          { label: 'จำนวนครู (รวม)', key: 'total_teachers', value: 3 },
          { label: 'จำนวนนักเรียน (รวม)', key: 'total_students', value: 4 },
          { label: 'ค่าเฉลี่ยคะแนนสูงสุด', key: 'highest_avg_score', value: 5 },
          { label: 'จำนวนห้องเรียนที่ใช้งาน', key: 'active_classrooms', value: 6 },
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

        <CWSelect
          title="สังกัดโรงเรียน"
          options={[
            { value: 'obec', label: 'สพฐ.' },
            { value: 'doe', label: 'สนศ. กทม.' },
            { value: 'lao', label: 'อปท.' },
            { value: 'opec', label: 'สช.' },
            { value: 'etc', label: 'อื่นๆ' },
          ]}
          value={schoolAffiliationType}
          onChange={(e) => setSchoolAffiliationType(e.target.value)}
          defaultValue={'doe'}
        />

        <SelectSchool
          inputValue={schoolValue}
          dropdownValue={schoolType}
          onInputValueChange={setSchoolValue}
          onDropdownValueChange={setSchoolType}
        />
      </ModalDownloadCustomKey>
    </div>
  );
};

export default DownloadClassAvgAllSchool;
