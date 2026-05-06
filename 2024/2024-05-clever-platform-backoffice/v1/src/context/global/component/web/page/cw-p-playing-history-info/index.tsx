import CWSwitchTabs from '@component/web/cs-switch-taps';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWSchoolCard from '@component/web/cw-school-card';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import EditNote from '@component/web/page/cw-p-playing-history-info/tabs/teachers-note/edit-note';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import {
  SchoolByIdResponse,
  SchoolStudentList,
  TeacherNoteResponse,
} from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { AccountStudentProfileResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import { DataAPIResponse } from '@global/utils/apiResponseHelper.ts';
import StoreGlobal from '@store/global';
import { useParams, useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

import GameStatistic from './tabs/game-statistic';
import GroupStudy from './tabs/group-study';
import Reward from './tabs/reward';
import TeachersNote from './tabs/teachers-note';
import AddNote from './tabs/teachers-note/add-note';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const CWPPlayingHistoryInfo = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const router = useRouter();
  const { schoolId, studentId, classId, academicYear, userId } = useParams({ from: '' });

  // ตรวจสอบ path ของ URL
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const [schoolData, setSchoolData] = useState<SchoolResponse>();
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

  const [student, setStudent] = useState<SchoolStudentList>();

  useEffect(() => {
    if (isAdminPath) {
      API_g03.accountStudent
        .GetAccountStudentProfile(studentId)
        .then((res: DataAPIResponse<SchoolStudentList>) => {
          if (res.status_code === 200) {
            setStudent(res.data);
          }
        })
        .catch((error) => console.error('Error fetching student:', error));
    }
    if (isTeacherPath) {
      API_g03.accountStudent
        .GetAccountStudentProfile(studentId)
        .then((res: DataAPIResponse<AccountStudentProfileResponse>) => {
          if (res.status_code === 200) {
            setStudent(res.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching student:', error);
        });
    }
  }, [studentId]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAddNotePage, setIsAddNotePage] = useState(false);
  const [isEditNotePage, setIsEditNotePage] = useState(false);

  const [noteUpdateData, setNoteUpdateData] = useState<TeacherNoteResponse>();

  const switchTabs = [
    {
      id: '1',
      label: 'สรุปคะแนน',
      content: <GameStatistic classroomId={classId} userId={student?.id ?? ''} />,
    },
    {
      id: '2',
      label: 'กลุ่มเรียน',
      content: <GroupStudy userStudentId={student?.id ?? ''} />,
    },
    // { id: '3', label: 'แบบทดสอบ', content: <Lesson /> },
    { id: '3', label: 'รางวัลฟรี', content: <Reward userId={student?.id ?? ''} /> },
    {
      id: '4',
      label: 'บักทึกของครู',
      content: (
        <TeachersNote
          userId={student?.id ?? ''}
          setIsAddNotePage={setIsAddNotePage}
          setIsEditNotePage={setIsEditNotePage}
          setNoteUpdateData={setNoteUpdateData}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 font-noto-sans-thai">
      <CWBreadcrumbs
        links={
          isTeacherPath
            ? [{ label: 'การเรียนการสอน', href: '#' }, { label: 'ข้อมูลนักเรียน' }]
            : isAdminPath
              ? [
                  { label: 'สำหรับแอดมิน', href: '#' },
                  { label: 'จัดการโรงเรียน', href: '#' },
                  { label: 'จัดการผู้ใช้งาน', href: '#' },
                  { label: 'ข้อมูลนักเรียน' },
                ]
              : [
                  { label: 'xxx', href: '#' },
                  { label: 'xxx', href: '#' },
                  { label: 'xxx' },
                ]
        }
      />

      <div
        className={`flex flex-col gap-5 ${isAddNotePage || isEditNotePage ? 'hidden' : ''}`}
      >
        <CWSchoolCard
          name={school?.name ?? schoolData?.school_name ?? '-'}
          code={school?.code ?? schoolData?.school_id?.toString() ?? '-'}
          subCode={
            school?.school_affiliation_short_name ?? schoolData?.school_code ?? '-'
          }
          image={school?.image_url ?? schoolData?.image_url ?? '/public/logo192.png'}
        />
        <CWNeutralBox className={'flex flex-col gap-2.5'}>
          <div className={'flex items-center gap-2.5'}>
            <div className="cursor-pointer p-2" onClick={() => router.history.back()}>
              <IconArrowBackward />
            </div>
            <span className="text-xl font-bold">
              {`${student?.title} ${student?.first_name} ${student?.last_name} / ปีการศึกษา ${academicYear}`}
            </span>
          </div>
          <div>
            uuid: {student?.id}, รหัสนักเรียน: {student?.student_id}
          </div>
        </CWNeutralBox>
        <CWSwitchTabs tabs={switchTabs} />
      </div>
      {isAddNotePage && (
        <AddNote
          setIsAddNotePage={setIsAddNotePage}
          userId={student?.id ?? ''}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}
      {isEditNotePage && (
        <EditNote
          setIsEditNotePage={setIsEditNotePage}
          userId={student?.id ?? ''}
          noteUpdateData={noteUpdateData}
          onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}
    </div>
  );
};

export default CWPPlayingHistoryInfo;
