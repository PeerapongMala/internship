import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import Breadcrumbs from '@component/web/atom/Breadcums';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import CWTitleBack from '@component/web/cw-title-back';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import TeacherStudentGroupLesson from '@domain/g03/g03-d03/g03-d03-p01-teacher-student-group-edit/component/web/template/lesson';
import StoreGlobal from '@global/store/global';

import TeacherStudentGroupInfo from './component/web/template/Info';
import TeacherStudentGroupMember from './component/web/template/Member';
import TeacherStudentGroupOverview from './component/web/template/overview';
import TeacherStudentGroupPlayLog from './component/web/template/Playlog';
import TeacherStudentGroupScore from './component/web/template/Score';
import TeacherStudentGroupResearch from './component/web/template/Research';
import ConfigJson from './config/index.json';
import API from '@domain/g03/g03-d03/local/api';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { studentGroupId } = useParams({ strict: false });
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();

  useEffect(() => {
    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code == 200) {
        let data: StudentGroupInfo = res.data;
        if (Array.isArray(data)) {
          data = data[0];
        }
        setStudentGroup(data);
      }
    });
  }, []);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const switchTabs = [
    {
      id: '1',
      label: 'ข้อมูลกลุ่มเรียน',
      content: <TeacherStudentGroupInfo />,
    },
    {
      id: '2',
      label: 'สมาชิก',
      content: <TeacherStudentGroupMember />,
    },
    {
      id: '3',
      label: 'ภาพรวม',
      content: <TeacherStudentGroupOverview />,
    },
    {
      id: '4',
      label: 'สรุปคะแนน',
      content: <TeacherStudentGroupScore />,
    },
    {
      id: '5',
      label: 'สถิติการเล่นนักเรียน',
      content: <TeacherStudentGroupPlayLog />,
    },
    {
      id: '6',
      label: 'บทเรียน',
      content: <TeacherStudentGroupLesson />,
    },
    {
      id: '7',
      label: 'วิจัยในชั้นเรียน',
      content: <TeacherStudentGroupResearch studentGroup={studentGroup?.name ?? ''} />,
    },
  ];

  return (
    <>
      <LayoutDefault>
        <CWBreadcrumbs
          links={[
            {
              label: 'การเรียนการสอน',
              href: '#',
            },
            {
              label: 'กลุ่มเรียน',
              href: '/teacher/student-group',
            },
            {
              label: `${studentGroup?.id} : ${studentGroup?.name}`,
              href: '/',
            },
          ]}
        />
        <div className="w-full">
          <div className="my-7">
            <CWTitleBack label="กลุ่มเรียน" href="/teacher/student-group" />
          </div>
        </div>
        <CWSwitchTabs tabs={switchTabs} />
      </LayoutDefault>
    </>
  );
};

export default DomainJSX;
