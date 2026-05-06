// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSelect from '@component/web/cw-select';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import CWButton from '@component/web/cw-button';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWWhiteBox from '@component/web/cw-white-box';
import { CWDashboard } from '../cw-dashboard';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWTitleBack from '@component/web/cw-title-back';
import CWNeutralBox from '@component/web/cw-neutral-box';
import ProgressBar from '../../organism/Progressbar';
import CwProgress from '@component/web/cw-progress';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import API from '@domain/g03/g03-d03/local/api';
import {
  Lesson,
  StudentOverview,
  SubLesson,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import WCADropdown from '../../atom/WCADropdown';
import SelectSubLesson from '@domain/g06/local/components/web/molecule/cw-select-sub-lesson';
import { formatTimeString } from '@global/utils/format/time';

const TeacherStudentGroupOverview = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { studentGroupId } = useParams({ from: '' });

  const [dateRange, setDateRange] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  ]);
  const startISO = dateRange[0]?.toISOString();
  const endISO = dateRange[1]?.toISOString();

  const [fetching, setFetching] = useState<boolean>(false);
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [lesson, setLesson] = useState<Lesson[]>([]);

  const [subLesson, setSublesson] = useState<SubLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<number[] | null>(null);
  const [selectedSubLesson, setSelectedSubLesson] = useState<number[] | undefined>(
    undefined,
  );

  const [cardViewData, setCardViewData] = useState<StudentOverview[]>([]);

  useEffect(() => {
    API.other.GetAcademicYears().then((res) => {
      if (res.status_code === 200) setAcademicYears(res.data);
    });
    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code === 200)
        setStudentGroup(Array.isArray(res.data) ? res.data[0] : res.data);
    });
  }, [studentGroupId]);

  useEffect(() => {
    if (studentGroupId !== null) {
      fetchLesson();
    } else {
      setLesson([]);
    }
  }, [studentGroupId]);
  useEffect(() => {
    if (selectedLesson !== null) {
      fetchSubLesson();
    } else {
      setSublesson([]);
    }
  }, [selectedLesson]);
  useEffect(() => {
    if (selectedLesson !== null) {
      fetchOverview();
    }
  }, [selectedLesson, selectedSubLesson]);

  const fetchLesson = async () => {
    if (!studentGroupId) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA01({
        study_group_id: studentGroupId,
        limit: -1,
      });
      if (res.status_code === 200) {
        setLesson(res.data);
        if (res.data.length > 0) {
          setSelectedLesson([res.data[0].lesson_id]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  const fetchSubLesson = async () => {
    if (!studentGroupId || !selectedLesson) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA02({
        study_group_id: studentGroupId,
        lesson_id: selectedLesson,
        limit: -1,
      });
      if (res.status_code === 200) {
        setSublesson(res.data);
        if (res.data.length > 0) {
          setSelectedSubLesson([res.data[0].lesson_id]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const fetchOverview = async () => {
    if (!studentGroupId || !selectedLesson) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA03({
        study_group_id: studentGroupId,
        lesson_ids: selectedLesson,
        sub_lesson_ids: selectedSubLesson,
        start_at: startISO,
        end_at: endISO,
      });
      if (res.status_code === 200) {
        setCardViewData(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  function formatDecimal(number: number, decimalPlaces = 2) {
    if (isNaN(number) || number === null || number === undefined) {
      return 0;
    }
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  }

  return (
    <div className="w-full">
      <CWNeutralBox className="">
        <h1 className="text-2xl font-bold">
          <div>
            <h1 className="text-2xl font-bold">
              <div>
                <h1 className="text-2xl font-bold"> {studentGroup?.name}</h1>
              </div>
            </h1>
          </div>
        </h1>
        <h2>
          ปีการศึกษา: {studentGroup?.class_academic_year} / {studentGroup?.subject_name} /{' '}
          {studentGroup?.class_year} / ห้อง {studentGroup?.class_name}
        </h2>
      </CWNeutralBox>

      <div className="mt-5">
        <div className="flex w-full justify-end">
          {/* <CWButton
            className="mt-5"
            title="Download"
            icon={<IconDownload />}
            onClick={() => alert('Download')}
          /> */}
        </div>
        <hr className="my-5" />
        <div className="my-5 grid w-full grid-cols-6 gap-2">
          <div className="flex flex-col gap-2">
            <p>วันที่</p>
            <WCAInputDateFlat
              placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป"
              value={dateRange}
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                locale: {
                  ...Thai,
                },
              }}
              onChange={(dates) => setDateRange(dates)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>บทเรียนหลัก</p>
            <WCADropdown
              placeholder={
                selectedLesson && lesson.length > 0
                  ? lesson.find((l) => l.lesson_id === selectedLesson[0])?.name ||
                    'เลือกบทเรียนหลัก'
                  : 'เลือกบทเรียนหลัก'
              }
              options={lesson.map((d) => ({
                label: d.name,
                value: d.lesson_id,
              }))}
              onSelect={(selected) => {
                setSelectedLesson([Number(selected)]);
                setSelectedSubLesson(undefined);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p>บทเรียนย่อย</p>
            <WCADropdown
              placeholder={
                selectedSubLesson && subLesson.length > 0
                  ? subLesson.find((l) => l.lesson_id === selectedSubLesson[0])?.name ||
                    'เลือกบทเรียนย่อย'
                  : 'เลือกบทเรียนย่อย'
              }
              options={subLesson.map((d) => ({
                label: d.name,
                value: d.lesson_id,
              }))}
              onSelect={(selected) => setSelectedSubLesson([Number(selected)])}
            />
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-4 gap-5">
        {/* ด่านที่ผ่านเฉลี่ย */}
        <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
          <h1 className="text-[16px]">ด่านทีผ่านเฉลี่ย (ด่าน)</h1>

          <h1 className="text-[28px] font-semibold">
            {formatDecimal(cardViewData?.[0]?.level_stats?.level_passed) ?? 0}/
            {cardViewData?.[0]?.level_stats?.total_level ?? 0}
          </h1>
          <ProgressBar
            score={cardViewData?.[0]?.level_stats?.level_passed ?? 0}
            total={cardViewData?.[0]?.level_stats?.total_level ?? 0}
          />
        </div>

        {/* คะแนนรวมเฉลี่ย */}
        <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
          <h1 className="text-[16px]">คะแนนรวมเฉลี่ย (คะแนน)</h1>
          <h1 className="text-[28px] font-semibold">
            {formatDecimal(cardViewData?.[0]?.score_stats?.average_score ?? 0)}/
            {cardViewData?.[0]?.score_stats?.total_score ?? 0}
          </h1>
          <ProgressBar
            score={cardViewData?.[0]?.score_stats?.average_score ?? 0}
            total={cardViewData?.[0]?.score_stats?.total_score ?? 0}
          />
        </div>

        {/* ทำข้อสอบเฉลี่ย */}
        <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
          <h1 className="text-[16px]">ทำข้อสอบเฉลี่ย (ครั้ง)</h1>
          <p className="text-[28px]">
            {formatDecimal(cardViewData?.[0]?.time_stats?.average_test_taken ?? 0)}
          </p>
        </div>

        {/* เวลาเฉลี่ยต่อข้อ */}
        <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
          <h1 className="text-[16px]">เวลาเฉลี่ยต่อข้อ</h1>
          <p className="text-[28px]">
            {formatTimeString(cardViewData?.[0]?.time_stats?.average_test_time ?? 0)}
          </p>
        </div>
      </div>

      {/* Dashborad */}
      <div className="w-full">
        <CWDashboard
          study_group_id={studentGroupId}
          lesson_ids={selectedLesson}
          sub_lesson_ids={selectedSubLesson}
          lesson_name={
            selectedLesson && lesson.length > 0
              ? lesson.find((l) => l.lesson_id === selectedLesson[0])?.name || ''
              : ''
          }
          studentGroup={studentGroup}
          start_at={dateRange[0]?.toISOString()}
          end_at={dateRange[1]?.toISOString()}
        />
      </div>
    </div>
  );
};

export default TeacherStudentGroupOverview;
