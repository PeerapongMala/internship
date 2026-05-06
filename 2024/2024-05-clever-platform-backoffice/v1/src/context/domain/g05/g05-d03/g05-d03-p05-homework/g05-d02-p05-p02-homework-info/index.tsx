import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import HomeworkInfoGroup from './component/web/molecule/cw-m-homework-info-group';
import TableDataHomeworkInfo from './component/web/molecule/cw-m-data-table-homework-info';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import router from '@global/utils/router-global';
import { useNavigate, useParams } from '@tanstack/react-router';
import TitleGroup from '@domain/g05/local/component/web/organism/cw-o-title-group';
import { TStudent } from '@domain/g05/local/types/student';
import { THomework } from '@domain/g05/local/api/helper/student';
import { useEffect, useState } from 'react';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
  const { studentId, homeworkId } = useParams({
    from: '/line/student/clever/homework/student/$studentId/homework/$homeworkId',
  });
  const [homeworkData, setHomeworkData] = useState<THomework>();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      try {
        const data = JSON.parse(decodeURIComponent(hash.substring(1)));
        setHomeworkData(data);
      } catch (error) {
        console.error('Error parsing homework data:', error);
      }
    }
  }, []);
  const homeworkInfo = homeworkData
    ? {
        subject: homeworkData.subject_name,
        assignTo: homeworkData.assign_to,
        unit: homeworkData.lesson,
        assignmentDate: homeworkData.started_at,
        dueDate: homeworkData.due_at,
      }
    : {
        subject: '',
        assignTo: '',
        unit: '',
        assignmentDate: '',
        dueDate: '',
      };

  const handleStudentData = (studentData: TStudent, classId?: number) => {
    if (classId) {
      handleStudentData(studentData, classId);
    }
  };
  return (
    <ScreenTemplate className="mb-24 items-center" headerTitle="Homework" header={false}>
      {/* <CWBreadcrumbs links={[{ label: 'เกี่ยวกับหลักสูตร' }, { label: 'การบ้าน' }]} /> */}

      <div className="mt-5 flex items-center px-5">
        <div className="absolute left-20 hover:cursor-pointer md:relative md:-left-10">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.history.back();
            }}
          >
            <IconArrowBackward />
          </a>
        </div>
        <p className="w-full text-center text-2xl font-bold">ข้อมูลการส่งการบ้าน</p>
      </div>

      {studentId ? (
        <div className="w-full px-5">
          <TitleGroup
            studentID={studentId}
            onStudentLoaded={(studentData) =>
              handleStudentData(studentData, studentData?.class_id)
            }
          />
        </div>
      ) : (
        <div className="text-red-500">ไม่พบข้อมูลนักเรียน</div>
      )}

      <div className="w-full px-5">
        <HomeworkInfoGroup {...homeworkInfo} />
      </div>

      <div className="w-full overflow-x-auto pl-5">
        <TableDataHomeworkInfo
          studentId={studentId || ''}
          homeworkID={homeworkId || ''}
        />
      </div>

      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
