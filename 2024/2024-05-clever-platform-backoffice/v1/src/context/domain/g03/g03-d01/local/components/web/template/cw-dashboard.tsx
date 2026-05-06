import CWHomeworkSection from './Layout/cw-homework-section';
import CWLevelSection from './Layout/cw-level-section';
import CWScoreOverviewSection from './Layout/cw-score-overview-section';
import CWQuestionOverviewSection from './Layout/cw-question-overview-section';
import { CWLessonProgressSection } from './Layout/cw-lesson-progress-section';
import { CWSublessonSection } from './Layout/cw-sublesson-section';
import CWLatestHomeworkSection from './Layout/cw-latedt-homework-section';
import { CWMinStudentsSection } from './Layout/cw-min-student-secion';
import { CWTopStudentsSection } from './Layout/cw-top-student-section';
import { Academicyear, DashboradProp } from '../../../type';
import { useState } from 'react';
import { DashboardGrid } from '@component/web/cw-dashboard-layout';
import { DashboardSection } from './cw-dashboard-layout';

export const CWDashboard = ({
  academicYearData,
  academicYear,
  year,
  classroom,
  subject_id,
  lesson_id,
  lesson_name,
  lessonOverview,
  start_at,
  end_at,
}: DashboradProp) => {
  const selectedAcademicYearData = academicYearData?.find(
    (item) => item.academic_year === academicYear,
  );

  const [homeworkSub, setHomeworkSub] = useState<number>(0);
  const [levelSub, setLevelSub] = useState<number>(0);
  const [levelSubPass, setLevelSubPass] = useState<number>(0);
  const [scoreSub, setScoreSub] = useState<number>(0);
  const [scoreSubPass, setScoreSubPass] = useState<number>(0);
  const [pointSub, setPointSub] = useState<number>(0);
  const [pointSubPass, setPointSubPass] = useState<number>(0);

  const [lessonSub, setLessonSub] = useState<number>(0);
  const [subLessonSub, setSubLessonSub] = useState<number>(0);

  return (
    <div className="flex w-full flex-col">
      <div className="mt-5">
        <DashboardGrid cols={2} className="h-[550px]">
          <DashboardSection
            title="ภาพรวมการบ้านทั้งหมด"
            number={homeworkSub ?? 0}
            subtitle="การบ้าน"
          >
            <CWHomeworkSection
              // academicYearData={
              //   selectedAcademicYearData ? [selectedAcademicYearData] : []
              // }
              academicYearData={academicYearData}
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              subject_id={subject_id ?? []}
              lesson_id={lesson_id ?? []}
              homwwork_total={homeworkSub}
              onHomeworkTotalChange={(value) => {
                setHomeworkSub(value);
              }}
              start_at={start_at}
              end_at={end_at}
            />
          </DashboardSection>

          <DashboardSection title="การบ้านล่าสุด" subtitle="">
            <CWLatestHomeworkSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              lesson_name={lesson_name}
              lesson_id={lesson_id}
            />
          </DashboardSection>
        </DashboardGrid>
      </div>

      <div className="mt-5">
        <DashboardGrid cols={3}>
          <DashboardSection
            title="จำนวนด่านที่ผ่านสูงสุด"
            number={levelSub ?? 0}
            passs_number={levelSubPass ?? 0}
            subtitle="ด่าน"
          >
            <CWLevelSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              level_total={levelSub}
              onLevelTotalChange={(value) => {
                setLevelSub(value);
              }}
              onLevelTotalPassChange={(value) => {
                setLevelSubPass(value);
              }}
              lesson_id={lesson_id}
            />
          </DashboardSection>

          <DashboardSection
            title="คะแนนเฉลี่ย"
            number={scoreSub ?? 0}
            passs_number={scoreSubPass ?? 0}
            subtitle="คะแนน"
          >
            <CWScoreOverviewSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              lesson_id={lesson_id}
              score_total={scoreSub}
              onScoreTotalChange={setScoreSub}
              onScoreTotalPassChange={setScoreSubPass}
            />
          </DashboardSection>

          <DashboardSection
            title="จำนวนแบบฝึกหัด"
            number={pointSub ?? 0}
            passs_number={pointSubPass}
            subtitle="ข้อ/คน"
            showPassNumber={false}
          >
            <CWQuestionOverviewSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              point_total={pointSub}
              onPointTotalChange={setPointSub}
              onPointTotalPassChange={setPointSubPass}
              lesson_id={lesson_id}
            />
          </DashboardSection>
        </DashboardGrid>
      </div>

      <div className="mt-5">
        <DashboardGrid cols={2} className="h-[500px]">
          <DashboardSection
            title="สรุปความก้าวหน้าระดับบทเรียน"
            number={lessonSub ?? 0}
            subtitle="บทเรียน"
          >
            <CWLessonProgressSection
              academicYearData={
                selectedAcademicYearData ? [selectedAcademicYearData] : []
              }
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              subject_id={subject_id ?? []}
              lesson_id={lesson_id ?? []}
              lesson_total={lessonSub}
              onLessonTotalChange={setLessonSub}
              lessonOverview={lessonOverview}
              start_at={start_at}
              end_at={end_at}
            />
          </DashboardSection>

          <DashboardSection
            title="ความก้าวหน้าแต่ละบทเรียนย่อย"
            number={subLessonSub ?? 0}
            subtitle="บทเรียนย่อย"
          >
            <CWSublessonSection
              academicYearData={
                selectedAcademicYearData ? [selectedAcademicYearData] : []
              }
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              subject_id={subject_id ?? []}
              lesson_id={lesson_id ?? []}
              sub_lesson_total={subLessonSub}
              onSubLessonTotalChange={setSubLessonSub}
              start_at={start_at}
              end_at={end_at}
            />
          </DashboardSection>
        </DashboardGrid>
      </div>

      <div className="mt-5">
        <DashboardGrid cols={2} className="my-12">
          <DashboardSection
            title="10 อันดับ นักเรียนที่ได้คะแนนสูงสุดในแต่ละบท"
            subtitle=""
          >
            <CWTopStudentsSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              subject_id={subject_id ?? []}
              lesson_id={lesson_id ?? []}
            />
          </DashboardSection>

          <DashboardSection
            title="10 อันดับ นักเรียนที่ได้คะแนนน้อยสุดในแต่ละบท"
            subtitle=""
          >
            <CWMinStudentsSection
              academicYear={academicYear}
              year={year}
              classroom={classroom ?? []}
              subject_id={subject_id ?? []}
              lesson_id={lesson_id ?? []}
            />
          </DashboardSection>
        </DashboardGrid>
      </div>
    </div>
  );
};
