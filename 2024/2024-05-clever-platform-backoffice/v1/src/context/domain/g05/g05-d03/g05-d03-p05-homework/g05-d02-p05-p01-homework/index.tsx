import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import BoxStatusHomework from './component/web/molecule/cw-m-box-status-homework';
import FilterStatusHomework from './component/web/molecule/cw-m-filter-status-homework';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import TitleGroup from '@domain/g05/local/component/web/organism/cw-o-title-group';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import StoreGlobalPersist from '@store/global/persist';
import { useState } from 'react';
import { TStudent } from '@domain/g05/local/types/student';

const mockStudents = [
  {
    id: '1',
    prefixName: 'เด็กหญิง',
    firstName: 'ณัฐชนก',
    lastName: 'พูนเพิ่ม',
    schoolID: '0000000001',
    schoolShort: 'AA109',
  },
];

const DomainJsx = () => {
  const student = mockStudents[0];
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const studentId = globalUserData?.id;
  // const studentId = 'b88cda2e-4551-413a-961a-88e176b02a2e'

  const [classId, setClassId] = useState<number>();

  const handleStudentData = (studentData: TStudent, classIdData?: number) => {
    if (classIdData) {
      setClassId(classIdData);
    }
  };

  return (
    <ScreenTemplate className="mb-24 text-center" headerTitle="Homework" header={false}>
      <div className="mt-5 flex flex-col items-center space-y-3 text-center">
        {/* <CWBreadcrumbs links={[{ label: 'เกี่ยวกับหลักสูตร' }, { label: 'การบ้าน' }]} /> */}
        {/* <CWTitleBack label="ข้อมูลการส่งการบ้าน" /> */}
        <h1 className="w-full text-center text-2xl font-bold">ข้อมูลการส่งการบ้าน</h1>
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
