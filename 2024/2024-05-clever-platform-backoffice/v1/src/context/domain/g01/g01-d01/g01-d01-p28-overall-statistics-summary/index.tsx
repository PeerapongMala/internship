import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import DownloadStudentOverall from './components/web/organism/cw-o-download-student-overall';
import DownloadLevelAvgAllSchool from './components/web/organism/cw-o-download-level-avg-all-school';
import DownloadStatusHomework from './components/web/organism/cw-o-download-status-homework';
import DownloadStudyGroup from './components/web/organism/cw-o-download-study-group';
import DownloadHighestClassroomAvgScore from './components/web/organism/cw-o-download-highest-classroom-average-score';
import DownloadClassAvgAllSchool from './components/web/organism/cw-o-download-class-avg-all-school';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { curriculumData } = StoreGlobalPersist.StateGet(['curriculumData']);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const handleNavigateToCurriculum = () => {
    if (curriculumData === null) {
      navigate({ to: '/curriculum' });
    } else {
      navigate({ to: '/content-creator/course' });
    }
  };

  return (
    <CWWhiteBox className="flex flex-col gap-5">
      <CWBreadcrumbs links={[{ label: 'สำหรับแอดมิน' }, { label: 'สรุปสถิติทั้งหมด' }]} />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-8">สังกัดโรงเรียน</h1>
        <p>
          สังกัดนี้จะใช้แกนหลักสูตรนี้เป็นค่าเริ่มต้น หากต้องการแก้ไขหลักสูตร
          กรุณาแก้ไขที่เมนู{' '}
          <span
            className="cursor-pointer text-primary underline"
            onClick={handleNavigateToCurriculum}
          >
            จัดการหลักสูตร
          </span>
        </p>
      </div>

      <CWWhiteBox className="flex flex-col">
        <span className="mb-6 text-2xl font-bold"> ภาพรวมนักเรียน</span>

        <div className="flex flex-col gap-8">
          <DownloadStudentOverall type="level" />
          <DownloadStudentOverall type="star" />
        </div>
      </CWWhiteBox>

      <CWWhiteBox className="flex flex-col">
        <span className="mb-6 text-2xl font-bold"> ภาพรวมครู</span>

        <div className="flex flex-col gap-8">
          <DownloadLevelAvgAllSchool />
          <DownloadStatusHomework />
          <DownloadStudyGroup />
          <DownloadHighestClassroomAvgScore />
        </div>
      </CWWhiteBox>

      <CWWhiteBox className="flex flex-col">
        <span className="mb-6 text-2xl font-bold"> รายงานระดับโรงเรียน</span>

        <div className="flex flex-col gap-8">
          <DownloadClassAvgAllSchool />
        </div>
      </CWWhiteBox>
    </CWWhiteBox>
  );
};

export default DomainJSX;
