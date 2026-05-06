// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { CWQuestion } from './component/web/template/cw-tap-question';
import { CWUnlock } from './component/web/template/cw-tap-unlock';
import { UnlockedGroup, GroupUnlock, SubLesson } from '../local/type';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import { LevelItem } from '@domain/g02/g02-d05/local/type';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const { classId, lessonId, sublessonId, levelId, subjectId } = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId',
    strict: false,
  });
  const [unlockedGroups, setUnlockedGroups] = useState<UnlockedGroup[]>([]);
  const [allGroups, setAllGroups] = useState<GroupUnlock[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, setPagination } = usePagination();

  const [subLessonData, setSubLessonData] = useState<SubLesson>();
  const [fetching, setFetching] = useState(false);
  const [standardData, setStandardData] = useState<LevelItem['standard']>();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const handleStandardReceived = (standard: LevelItem['standard']) => {
    setStandardData(standard);
  };

  useEffect(() => {
    fetchSubLessons();
  }, [sublessonId]);

  const fetchGroups = async (
    page: number,
    limit: number,
    searchField?: string,
    searchValue?: string,
  ) => {
    try {
      setLoading(true);
      const response = await LessonRestAPI.GetGroups(
        classId,
        subjectId,
        page,
        limit,
        searchField,
        searchValue,
      );
      setAllGroups(response.data);
      return response;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchSubLessons = async () => {
    console.log('subjectId', lessonId);
    try {
      setFetching(true);
      const response = await LessonRestAPI.GetSubLessons(
        classId,
        Number(lessonId),
        pagination.page,
        pagination.limit,
        undefined,
        sublessonId,
      );

      const transformedData: SubLesson[] = response.data.map((item) => ({
        id: item.sub_lesson_id,
        curriculum_group_short_name: item.curriculum_group,
        subject: item.subject,
        year: item.year,
        sublesson_name: item.sub_lesson_name,
        is_enabled: item.is_enabled,
      }));

      setSubLessonData(transformedData[0]);
    } catch (error) {
      console.error('Failed to fetch sub-lessons:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนย่อยได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  const switchTabs = [
    {
      id: '1',
      label: 'ดูคำถาม',
      content: <CWQuestion levelId={levelId} onStandardLoaded={handleStandardReceived} />,
    },
    {
      id: '2',
      label: 'ปลดล็อคด่าน',
      content: (
        <CWUnlock
          unlockedGroups={unlockedGroups}
          setUnlockedGroups={setUnlockedGroups}
          allGroups={allGroups}
          fetchGroups={fetchGroups}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'จัดการบทเรียน', href: '#' },
          { label: `${subLessonData?.sublesson_name}`, href: '#' },
          { label: `ด่านที่ ${levelId}`, href: '#' },
        ]}
      />
      <div className="my-5 w-full">
        <CWTitleBack
          label="ข้อมูลด่าน"
          href={`/teacher/lesson/${classId}/subject/${subjectId}/${lessonId}/sublesson/${sublessonId}`}
        />
      </div>

      <div className="mb-5 mt-5 flex w-full flex-col rounded-md bg-neutral-100 px-2 py-3">
        <div className="flex">
          <h1 className="text-[24px] font-bold">ด่านที่ {levelId}</h1>
        </div>
        <div className="mt-3">
          {subLessonData?.curriculum_group_short_name} / {subLessonData?.subject} /{' '}
          {subLessonData?.year} / {subLessonData?.sublesson_name} /{' '}
          {standardData?.criteria_name}
        </div>
      </div>

      <div className="mb-5 w-full">
        <CWSwitchTabs tabs={switchTabs} />
      </div>
    </div>
  );
};

export default DomainJSX;
