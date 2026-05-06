import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import CWSelect from '@component/web/cw-select';
import CWNotplay from '../Table/cw-not-play';
import CWTopThreeScore from '../Table/cw-top-three';
import CWStudentOnline from '../Table/cw-student-online';
import { DashboardGrid, DashboardSection } from '@component/web/cw-dashboard-layout';
import CWLessonSection from '../cw-layout-overview/cw-lesson-section';
import CWSubLessonSection from '../cw-layout-overview/cw-sub-lesson-section';
import { DashboradProp } from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import CWStudentOverviewSection from '../cw-layout-overview/cw-student-overview-section';
import { useState } from 'react';
import CWLevelSection from '../cw-layout-overview/cw-level-section';

export const CWDashboard = ({
  study_group_id,
  lesson_ids,
  sub_lesson_ids,
  lesson_name,
  studentGroup,
  start_at,
  end_at,
}: DashboradProp) => {
  const [totalLevel, setTotalLevel] = useState<number>();

  const [lessonSub, setLessonSub] = useState<number>();
  const [subLessonSub, setSubLessonSub] = useState<number>();

  return (
    <div className="flex w-full flex-col">
      {/* dashboard 2 item */}
      <DashboardGrid cols={1} className="mb-[15px] h-[450px]">
        <DashboardSection
          title="จำนวนด่านที่ผ่านโดยเฉลี่ย / ด่านทั้งหมด"
          number={totalLevel}
          subtitle="ด่าน"
        >
          <CWLevelSection
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
            onLevelTotalChange={setTotalLevel}
            start_at={start_at}
            end_at={end_at}
          />
        </DashboardSection>

        {/* <DashboardSection title="การบ้านล่าสุด" subtitle=''>
          <CWOverviewStudent />
        </DashboardSection> */}
      </DashboardGrid>

      {/* dashboard 2 item */}
      <DashboardGrid cols={2} className="mt-4 h-[550px]">
        <DashboardSection
          title="สรุปความก้าวหน้าระดับบทเรียน"
          number={lessonSub ?? 0}
          subtitle="บทเรียน"
        >
          <CWLessonSection
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
            lesson_name={lesson_name}
            studentGroup={studentGroup}
            start_at={start_at}
            end_at={end_at}
            onLessonTotalChange={setLessonSub}
          />
        </DashboardSection>

        <DashboardSection
          title="ความก้าวหน้าแต่ละบทเรียนย่อย"
          number={subLessonSub ?? 0}
          subtitle="บทเรียน"
        >
          <CWSubLessonSection
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
            lesson_name={lesson_name}
            start_at={start_at}
            end_at={end_at}
            onSubLessonTotalChange={setSubLessonSub}
          />
        </DashboardSection>
      </DashboardGrid>

      <div className="mt-[72px] grid h-auto w-full grid-cols-3 gap-5">
        <div className="col-span-1 rounded-md bg-white shadow-md">
          <CWTopThreeScore
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
            lesson_name={lesson_name}
          />
        </div>
        <div className="col-span-1 rounded-md bg-white shadow-md">
          <CWStudentOnline
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
          />
        </div>
        <div className="col-span-1 rounded-md bg-white shadow-md">
          <CWNotplay
            study_group_id={study_group_id}
            lesson_ids={lesson_ids}
            sub_lesson_ids={sub_lesson_ids}
          />
        </div>
      </div>
    </div>
  );
};
