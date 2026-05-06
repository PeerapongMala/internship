// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTitleBack from '@component/web/cw-title-back';
import { CWQuestion } from './component/web/template/cw-tap-question';
import { UnlockedGroup, GroupUnlock, SubLesson } from '../local/type';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import showMessage from '@global/utils/showMessage';
import { LevelItem } from '@domain/g02/g02-d05/local/type';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const { studentId, classId, subjectId, lessonId, sublessonId, levelId } = useParams({
    from: '/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId',
  });

  const [unlockedGroups, setUnlockedGroups] = useState<UnlockedGroup[]>([]);
  const [allGroups, setAllGroups] = useState<GroupUnlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [subLessonData, setSubLessonData] = useState<SubLesson>();
  const [fetching, setFetching] = useState(false);
  const { pagination, setPagination } = usePagination();
  const [standardData, setStandardData] = useState<LevelItem['standard']>();

  const handleStandardReceived = (standard: LevelItem['standard']) => {
    setStandardData(standard);
  };
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  useEffect(() => {
    fetchGroups(pagination.page, pagination.limit);
    fetchSubLessons();
  }, [pagination.page, pagination.limit, sublessonId]);
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

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <div className="my-5 w-full">
          <div className="relative flex w-full items-center justify-center sm:justify-start">
            <div className="absolute left-0">
              <CWTitleBack
                label=""
                href={`/line/parent/clever/${studentId}/${classId}/subject/${subjectId}/${lessonId}/sublesson/${sublessonId}`}
              />
            </div>

            <p className="text-center text-[26px] font-bold sm:pl-10 sm:text-left">
              ข้อมูลด่าน
            </p>
          </div>
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
        <CWQuestion levelId={levelId} onStandardLoaded={handleStandardReceived} />

        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplateWithoutHeader>
  );
};

export default DomainJSX;
