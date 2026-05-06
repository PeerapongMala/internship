import CWButton from '@component/web/cw-button';

import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import { TStudentFilter } from '@domain/g06/g06-d07/local/types/students';
import API from '@domain/g06/g06-d07/local/api';
import showMessage from '@global/utils/showMessage';
import dayjs from '@global/utils/dayjs';
import { getUserData } from '@global/utils/store/getUserData';

type ButtonDownloadCSVProps = {
  className?: string;
  filter: TStudentFilter;
};

const ButtonDownloadCSV = ({ className, filter }: ButtonDownloadCSVProps) => {
  const baseFileName = 'student_info-grade_system_setting';

  const userData = getUserData();

  const handleDownload = async () => {
    if (!filter.academic_year || !filter.year || !filter.school_room) {
      showMessage('โปรดเลือก ปีการศึกษา, ชั้นปี และชั้นเรียนให้ครบถ้วน', 'warning');
      return;
    }

    try {
      const response = await API.GradeSetting.DownloadStudentInformation({
        school_id: Number(userData?.school_id),
        ...filter,
      });
      handleDownloadPrompt(response.data);
    } catch (error) {
      showMessage('พบปัญหาในการดาวน์โหลดไฟล์', 'error');
      throw error;
    }
  };

  const handleDownloadPrompt = (file: Blob) => {
    const url = window.URL.createObjectURL(file);
    const fileName = `${baseFileName}-${dayjs().format('YYYY-MM-DD')}.csv`;

    // Create and click a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Set file name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <CWButton
      className={className}
      title={'Download'}
      icon={<IconDownload />}
      onClick={handleDownload}
    />
  );
};

export default ButtonDownloadCSV;
