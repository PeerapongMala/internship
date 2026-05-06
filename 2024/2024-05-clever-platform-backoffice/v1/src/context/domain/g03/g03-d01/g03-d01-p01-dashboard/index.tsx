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
import StoreGlobalPersist from '@store/global/persist';
import { getAcademicYearRange } from '@global/utils/store/get-academic-year-range-data';
import { getLesson } from '@global/utils/store/get-lesson-data';
import { getClassData } from '@global/utils/store/get-class-data';
import { getUserData } from '@global/utils/store/getUserData';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/dashboard') {
        navigate({ to: '/line/teacher/dashboard' });
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
  const [lessonOverview, setLessonOverview] = useState<resLesson[] | null>(null);

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
  const handleDateChange = (startDate: string | null, endDate: string | null) => {
    setSelectedStart(startDate);
    setSelectedEnd(endDate);

    if (academicYearRangeData && startDate && endDate) {
      const updatedRange = {
        ...academicYearRangeData,
        start_date: startDate,
        end_date: endDate,
      };
      StoreGlobalPersist.MethodGet().setAcademicYearRangeData(updatedRange);
    }
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'ภาพรวมนักเรียน', href: '/teacher/dashboard' },
        ]}
      />
      <div className="mt-5">
        <h1 className="text-2xl font-bold">ภาพรวมนักเรียน</h1>
        <CWHeaderSection
          academicYear={academicYear}
          year={year}
          classroom={classroom}
          subject={subject}
          lesson={lesson}
          selectedAcademicYear={selectedAcademicYear}
          selectedYear={classData?.year ?? selectedYear}
          selectedClassroom={selectedClassroom}
          selectedSubject={selectedSubject}
          selectedLesson={selectedLesson}
          onAcademicYearChange={handleAcademicYearChange}
          onYearChange={setSelectedYear}
          onClassroomChange={setSelectedClassroom}
          onSubjectChange={setSelectedSubject}
          onLessonChange={setSelectedLesson}
          selectedStartDate={selectedStart}
          selectedEndDate={selectedEnd}
          onDateChange={handleDateChange}
        />
      </div>

      <hr className="my-5" />

      <CWSummaryCards responsible={selectedYear || '-'} totalStudent={totalStudent} />
      {/* Dashborad */}
      <div className="w-full">
        <CWDashboard
          academicYearData={academicYear}
          academicYear={selectedAcademicYear}
          year={selectedYear}
          classroom={selectedClassroom}
          subject_id={selectedSubject}
          lesson_id={selectedLesson}
          lesson_name={lessonData && lessonData[0]?.name ? lessonData[0]?.name : ''}
          lessonOverview={lessonOverview}
          start_at={selectedStart}
          end_at={selectedEnd}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
