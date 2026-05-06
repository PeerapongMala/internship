import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import FilterGroup from './component/web/organism/cw-o-filter-group';
import LessonInfo from './component/web/organism/cw-o-lesson-info';
import UnitLessonInfo from './component/web/organism/cw-o-unit-lesson-info';
import LevelInfo from './component/web/organism/cw-o-level-info';
import CardStatistic from '@domain/g05/g05-d00/local/component/web/organism/cw-o-card-statistic';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import TitleGroup from '@domain/g05/local/component/web/organism/cw-o-title-group';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { FilterLubLesson, OverviewStats, Subject } from '../../local/types/overview';
import API from '../../local/api';
import showMessage from '@global/utils/showMessage';
import { TPagination } from '../../local/types';
import CWCardStatistic from '../../local/component/web/organism/cw-card-statistic';
import { roundNumber } from '@global/utils/number';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import StoreGlobal from '@store/global';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  const params = useParams({ from: '/line/parent/clever/dashboard/$user_id' });
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
  }, [params.user_id, classId]);
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
  }, [params.user_id, classId]);
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
  }, [params.user_id, classId]);
  useEffect(() => {
    fetchOverview();
  }, [selectedSubject, startDate, endDate]);

  const fetchSubject = async () => {
    if (!params.user_id || !classId) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetSubject(params.user_id, classId, {});
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
    if (!params.user_id || !classId || !selectedSubject) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetFilterLesson(params.user_id, selectedSubject, {
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
    if (!params.user_id || !classId || !selectedSubject) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetOverview(
        params.user_id,
        classId,
        selectedSubject,
        {
          started_at: startDate,
          ended_at: endDate,
        },
      );
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
      className="mb-20 px-5 text-center"
      headerTitle="Clever Login"
      header={false}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mt-5 flex items-center">
          <button
            className="absolute left-20 hover:cursor-pointer md:relative md:-left-10"
            onClick={() => navigate({ to: '../choose-student' })}
          >
            <IconArrowBackward />
          </button>
          <span className="text-2xl font-bold">ภาพรวม</span>
        </div>
      </div>
      <TitleGroup studentID={params.user_id} class_ids={setClassId} />
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
          user_id={params.user_id}
          class_id={classId}
        />
        <UnitLessonInfo
          selectedSubject={selectedSubject}
          user_id={params.user_id}
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
