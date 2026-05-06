import CWSwitchTabs from '@component/web/cs-switch-taps';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWSchoolCard from '@component/web/cw-school-card';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { SchoolByIdResponse, SchoolStudentList } from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { AccountStudentProfileResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import { DataAPIResponse } from '@global/utils/apiResponseHelper.ts';
import StoreGlobal from '@store/global';
import { useParams, useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

import AccountInfo from './tabs/account-info';
import FamilyInfo from './tabs/family-info';
import PlayingHistory from './tabs/playing-history';
import StudentInfo from './tabs/student-info';
import CWImg from '@component/web/atom/wc-a-img';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const CWPStudentInfo = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [student, setStudent] = useState<
    SchoolStudentList | AccountStudentProfileResponse
  >();
  const [schoolData, setSchoolData] = useState<SchoolResponse>();

  const router = useRouter();
  const { schoolId, studentId } = useParams({ from: '' });

  // ตรวจสอบ path ของ URL
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const isCreateMode = studentId === 'new';

  const [school, setSchool] = useState<SchoolByIdResponse>();

  useEffect(() => {
    if (schoolId) {
      API_g01.school.GetById(schoolId).then((res) => {
        setSchool(res);
      });
    } else {
      API_g03.school.GetSchoolId().then((res) => {
        if (res.status_code === 200) {
          setSchoolData(res.data);
        }
      });
    }
  }, [schoolId]);

  useEffect(() => {
    if (!isCreateMode) {
      fetchStudent(studentId);
    } else {
      setStudent({
        id: '',
        student_id: '',
        first_name: '',
        last_name: '',
        title: '',
      } as SchoolStudentList);
    }
  }, [studentId, isCreateMode]);

  function fetchStudent(studentId: string) {
    if (isAdminPath) {
      API_g01.schoolStudent
        .GetById(studentId)
        .then((res: DataAPIResponse<SchoolStudentList>) => {
          if (res.status_code === 200 && res.data) {
            setStudent(res.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    } else if (isTeacherPath) {
      API_g03.accountStudent
        .GetAccountStudentProfile(studentId)
        .then((res) => {
          if (res.status_code === 200) {
            setStudent(res.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    }
  }

  const studentInfoTab = {
    id: '1',
    label: isCreateMode ? 'สร้างข้อมูลนักเรียน' : 'ข้อมูลนักเรียน',
    content: student ? (
      <StudentInfo student={student} fetchStudent={fetchStudent} />
    ) : (
      <div className="mt-5">Loading...</div>
    ),
  };

  const switchTabs = [
    studentInfoTab,
    {
      id: '2',
      label: 'ข้อมูลบัญชี',
      content: student ? <AccountInfo student={student} /> : <div>Loading...</div>,
    },
    {
      id: '3',
      label: 'ประวัติการเล่น',
      content: <PlayingHistory studentId={studentId} />,
    },
    { id: '4', label: 'ครอบครัว', content: <FamilyInfo userId={studentId} /> },
  ];

  return (
    <div className="flex flex-col gap-5 font-noto-sans-thai">
      <CWBreadcrumbs
        links={
          isTeacherPath
            ? [{ label: 'การเรียนการสอน', href: '#' }, { label: 'ข้อมูลนักเรียน' }]
            : isAdminPath
              ? [
                  { label: 'สำหรับแอดมิน', href: '/', disabled: true },
                  { label: 'จัดการโรงเรียน', href: '/admin/school' },

                  {
                    label: 'จัดการผู้ใช้งาน',
                    href: '/admin/school/1?tab=user-management',
                  },
                  { label: 'ข้อมูลนักเรียน' },
                ]
              : [
                  { label: 'xxx', href: '#' },
                  { label: 'xxx', href: '#' },
                  { label: 'xxx' },
                ]
        }
      />
      <CWSchoolCard
        name={school?.name ?? schoolData?.school_name ?? '-'}
        code={school?.code ?? schoolData?.school_id?.toString() ?? '-'}
        subCode={school?.school_affiliation_short_name ?? schoolData?.school_code ?? '-'}
        image={school?.image_url ?? schoolData?.image_url ?? '/public/logo192.png'}
      />

      <CWNeutralBox className={'flex flex-col gap-2.5'}>
        <div className={'flex items-center gap-2.5'}>
          <div className="cursor-pointer p-2" onClick={() => router.history.back()}>
            <IconArrowBackward />
          </div>
          <span className={'text-xl font-bold'}>
            {isCreateMode
              ? 'สร้างข้อมูลนักเรียน'
              : student
                ? `${student?.title} ${student?.first_name} ${student?.last_name}`
                : 'ไม่พบข้อมูลนักเรียน'}
          </span>
        </div>
        {!isCreateMode && student && (
          <div>
            uuid: {student?.id}, รหัสนักเรียน: {student?.student_id}
          </div>
        )}
      </CWNeutralBox>

      {!isCreateMode && student !== null ? (
        <CWSwitchTabs tabs={switchTabs} />
      ) : (
        studentInfoTab.content
      )}
    </div>
  );
};

export default CWPStudentInfo;
