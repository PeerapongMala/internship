// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { CWDashboard } from '../local/components/web/template/cw-dashboard';
import {
  Academicyear,
  Classroom,
  Lesson,
  resLesson,
  Subject,
  TotalStudent,
  Year,
} from '../local/type';
import API from '../local/api';

import CWHeaderSection from '../local/components/web/organism/cw-header';
import CWSummaryCards from '../local/components/web/organism/cw-submary-card';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import { getAcademicYearRange } from '@global/utils/store/get-academic-year-range-data';
import { getLesson } from '@global/utils/store/get-lesson-data';
import { getClassData } from '@global/utils/store/get-class-data';
import { getUserData } from '@global/utils/store/getUserData';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/teacher/dashboard') {
        navigate({ to: '/teacher/dashboard' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const academicYearRangeData = getAcademicYearRange();
  const lessonData = getLesson();
  const classData = getClassData();
  const getUser = getUserData();
  const subjectId = getUser?.subject[0]?.id;

  const [fetching, setFetching] = useState<boolean>(false);
  const [academicYear, setAcademicYear] = useState<Academicyear[]>(() => {
    if (!academicYearRangeData) return [];
    const academicYearItem: Academicyear = {
      academic_year: Number(academicYearRangeData.name),
      start_date: academicYearRangeData.start_date,
      end_date: academicYearRangeData.end_date,
    };
    return [academicYearItem];
  });
  const [year, setYear] = useState<Year[]>([]);
  const [classroom, setClassroom] = useState<Classroom[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [lesson, setLesson] = useState<Lesson[]>([]);
  const [totalStudent, setTotalStudent] = useState<TotalStudent | null>(null);

  // filter
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(
    academicYearRangeData?.name ? Number(academicYearRangeData.name) : null,
  );

  const [selectedYear, setSelectedYear] = useState<string | null>(
    classData?.year || null,
  );
  const [selectedClassroom, setSelectedClassroom] = useState<number[] | null>(
    classData?.class_id ? [classData.class_id] : null,
  );

  const [selectedSubject, setSelectedSubject] = useState<number[] | null>(
    subjectId ? [subjectId] : null,
  );

  const [selectedLesson, setSelectedLesson] = useState<number[] | null>(
    lessonData && lessonData[0]?.lesson_id ? [lessonData[0].lesson_id] : null,
  );

  const [selectedStart, setSelectedStart] = useState<string | null>(
    academicYearRangeData?.start_date ?? null,
  );
  const [selectedEnd, setSelectedEnd] = useState<string | null>(
    academicYearRangeData?.end_date ?? null,
  );

  useEffect(() => {
    if (academicYearRangeData) {
      setSelectedAcademicYear(Number(academicYearRangeData.name));
      setSelectedStart(academicYearRangeData?.start_date);
      setSelectedEnd(academicYearRangeData?.end_date);
    }
  }, [academicYearRangeData]);
  useEffect(() => {
    if (classData) {
      setSelectedClassroom(classData?.class_id ? [classData.class_id] : null);
      setSelectedYear(classData?.year ? classData.year : null);
    }
  }, [classData]);

  useEffect(() => {
    if (lessonData) {
      setSelectedLesson([lessonData[0].lesson_id]);
    }
  }, [lessonData]);

  useEffect(() => {
    const fetchTotalStudent = async () => {
      if (!selectedClassroom) return;
      setFetching(true);
      try {
        const res = await API.dashboard.GetA04({
          class_id: selectedClassroom,
        });
        if (res.status_code === 200) {
          setTotalStudent(res.data[0]);
        }
      } catch (err) {
        console.error('Error fetching total student:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchTotalStudent();
  }, [selectedClassroom]);

  const handleAcademicYearChange = async (value: number | null) => {
    if (value === null) return;

    setSelectedAcademicYear(value);
    setFetching(true);

    try {
      // Fetch year based on new academic year
      const yearRes = await API.dashboard.GetA02({ academic_year: value });
      if (yearRes.status_code === 200) {
        setYear(yearRes.data);
        setSelectedYear(yearRes.data.length > 0 ? yearRes.data[0].year : null);
        setClassroom([]);
        setSubject([]);
        setLesson([]);
        setSelectedClassroom(null);
        setSelectedSubject(null);
        setSelectedLesson(null);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <LineLiffPage className="mb-20 w-full">
      <div className="mt-5 w-full">
        <h1 className="text-center text-2xl font-bold">ภาพรวมครู</h1>
        <CWHeaderSection
          academicYear={academicYear}
          year={year}
          classroom={classroom}
          subject={subject}
          lesson={lesson}
          selectedAcademicYear={selectedAcademicYear}
          selectedYear={selectedYear}
          selectedClassroom={selectedClassroom}
          selectedSubject={selectedSubject}
          selectedLesson={selectedLesson}
          onAcademicYearChange={handleAcademicYearChange}
          onYearChange={setSelectedYear}
          onClassroomChange={setSelectedClassroom}
          onSubjectChange={setSelectedSubject}
          onLessonChange={setSelectedLesson}
        />
      </div>

      <hr className="my-5" />

      <CWSummaryCards responsible={selectedYear || '-'} totalStudent={totalStudent} />

      <div className="w-full">
        <CWDashboard
          academicYearData={academicYear}
          academicYear={selectedAcademicYear}
          year={selectedYear}
          classroom={selectedClassroom}
          subject_id={selectedSubject}
          lesson_id={selectedLesson}
          start_at={selectedStart}
          end_at={selectedEnd}
        />
      </div>
      <FooterMenu />
    </LineLiffPage>
  );
};

export default DomainJSX;
