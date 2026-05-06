import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import BoxStatusHomework from './component/web/molecule/cw-m-box-status-homework';
import FilterStatusHomework from './component/web/molecule/cw-m-filter-status-homework';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import TitleGroup from '@domain/g05/local/component/web/organism/cw-o-title-group';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { TStudent } from '@domain/g05/local/types/student';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
  const params = useParams({ from: '/line/parent/clever/homework/student/$studentId' });
  const studentId: string = params.studentId;
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [student, setStudent] = useState<TStudent>();
  const [classId, setClassId] = useState<number>();

  const handleStudentData = (studentData: TStudent, classIdData?: number) => {
    setStudent(studentData);
    if (classIdData) {
      setClassId(classIdData);
    }
  };

  return (
    <ScreenTemplate className="mb-20 items-center" headerTitle="Homework" header={false}>
      {/* <CWBreadcrumbs links={[{ label: 'เกี่ยวกับหลักสูตร' }, { label: 'การบ้าน' }]} /> */}
      <div className="mt-5 flex items-center px-5">
        <div className="absolute left-10 hover:cursor-pointer md:relative md:-left-10">
          <a href="/line/parent/clever/homework/choose-student">
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

      <BoxStatusHomework studentId={studentId} classId={classId} />
      <FilterStatusHomework studentId={studentId} classId={classId} />
      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
