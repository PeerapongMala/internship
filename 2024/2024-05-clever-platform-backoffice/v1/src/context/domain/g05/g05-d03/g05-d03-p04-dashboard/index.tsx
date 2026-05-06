import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import FilterGroup from './component/web/organism/cw-o-filter-group';
import LessonInfo from './component/web/organism/cw-o-lesson-info';
import UnitLessonInfo from './component/web/organism/cw-o-unit-lesson-info';
import LevelInfo from './component/web/organism/cw-o-level-info';
import FooterMenu from '../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';

import TitleGroup from '@domain/g05/local/component/web/organism/cw-o-title-group';
import { useParams } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import { useEffect, useState } from 'react';
import showMessage from '@global/utils/showMessage';
import { FilterLubLesson, OverviewStats, Subject } from '../local/types/overview';
import { TPagination } from '../local/types';
import API from '../local/api';
import { roundNumber } from '@global/utils/number';
import CWCardStatistic from '@domain/g05/g05-d02/local/component/web/organism/cw-card-statistic';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  // const params = useParams({ from: '/line/student/clever/dashboard/$id' });
  // const studentId: string = params.studentId;
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  console.log({ globalUserData: globalUserData?.id });
  const studentId = globalUserData?.id;
  // const [user, setUser] = useState({
  //   first_name: '',
  //   last_name: '',
  //   image_url: '',
  //   access_token: '',
  // });
  // useEffect(() => {
  //   if (globalUserData) {
  //     setUser(globalUserData);
  //   }
  // }, [globalUserData]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [classId, setClassId] = useState<number | null>(null);

  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const [subject, setSubject] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [lessonData, setLessonData] = useState<FilterLubLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number>();

  const [overviewData, setOverviewData] = useState<OverviewStats | null>(null);

  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    if (classId) {
      fetchSubject();
    }
    // ตั้งค่า startDate และ endDate
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(firstDayOfMonth));
    setEndDate(formatDate(lastDayOfMonth));
  }, [studentId, classId]);
  useEffect(() => {
    if (classId) {
      fetchSubject();
    }
    // ตั้งค่า startDate และ endDate
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(firstDayOfMonth));
    setEndDate(formatDate(lastDayOfMonth));
  }, [studentId, classId]);
  useEffect(() => {
    if (selectedSubject) {
      fetchLesson();
      setSelectedLesson(undefined);
    }
  }, [selectedSubject]);
  useEffect(() => {
    if (classId) {
      fetchSubject();
    }
  }, [studentId, classId]);
  useEffect(() => {
    fetchOverview();
  }, [selectedSubject, startDate, endDate]);

  const fetchSubject = async () => {
    if (!studentId || !classId) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetSubject(studentId, classId, {});
      if (res.status_code === 200) {
        setSubject(res.data);
        if (res.data.length > 0) {
          setSelectedSubject(res.data[0].subject_id || null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage(error, 'error');
    } finally {
      setFetching(false);
    }
  };
  const fetchLesson = async () => {
    if (!studentId || !classId || !selectedSubject) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetFilterLesson(studentId, selectedSubject, {
        page: 1,
        limit: -1,
      });
      if (res.status_code === 200) {
        setLessonData(res.data);
        if (res.data.length > 0) {
          setSelectedLesson(res.data[0].lesson_id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage(error, 'error');
    } finally {
      setFetching(false);
    }
  };
  const fetchOverview = async () => {
    if (!studentId || !classId || !selectedSubject) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetOverview(studentId, classId, selectedSubject, {
        started_at: startDate,
        ended_at: endDate,
      });
      if (res.status_code === 200) {
        setOverviewData(res.data);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage(error, 'error');
    } finally {
      setFetching(false);
    }
  };
  return (
    <ScreenTemplate
      className="mb-20 text-center"
      headerTitle="Clever Login"
      header={false}
    >
      <div className="mt-5 flex flex-col items-center text-center">
        <span className="text-2xl font-bold">ภาพรวม</span>
      </div>
      <TitleGroup studentID={studentId} class_ids={setClassId} />

      <FilterGroup
        subjectData={subject}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        lessonData={lessonData}
        selectedLesson={selectedLesson}
        onLessonChange={(lessonId) => {
          setSelectedLesson(lessonId);
          setPagination((prev) => ({ ...prev, page: 1 }));
        }}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <CWCardStatistic
          title="ด่านที่ผ่านเฉลี่ย (ด่าน)"
          value={overviewData?.level_stats?.level_passed ?? 0}
          total={overviewData?.level_stats?.total_level ?? 0}
          progress={overviewData?.level_stats?.level_passed ?? 0}
        />
        <CWCardStatistic
          title="คะแนนรวมเฉลี่ย (คะแนน)"
          value={overviewData?.score_stats?.score ?? 0}
          total={overviewData?.score_stats?.total_score ?? 0}
          progress={overviewData?.score_stats?.score ?? 0}
        />
        <CWCardStatistic
          title="ทำข้อสอบเฉลี่ย​ (ครั้ง)"
          value={roundNumber(overviewData?.point_stats?.attemp_count ?? 0)}
        />
        <CWCardStatistic
          title="เวลาต่อข้อเฉลี่ย"
          value={formatTimeString(overviewData?.time_stats?.average_test_time ?? 0)}
        />
      </div>
      <LevelInfo overviewData={overviewData} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <LessonInfo
          subjectData={subject}
          selectedSubject={selectedSubject}
          user_id={studentId}
          class_id={classId}
        />
        <UnitLessonInfo
          selectedSubject={selectedSubject}
          user_id={studentId}
          class_id={classId}
          lessonData={lessonData}
          selectedLesson={selectedLesson}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
