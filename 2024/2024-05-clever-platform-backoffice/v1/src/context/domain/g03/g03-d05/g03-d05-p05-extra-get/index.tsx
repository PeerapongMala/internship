// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';

import { CWUnlock } from './component/web/template/cw-tap-unlock';
import { UnlockedGroup, GroupUnlock, SubLesson } from '../local/type';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import { LevelItem } from '@domain/g02/g02-d05/local/type';
import showMessage from '@global/utils/showMessage';
import { LessonResponse } from '../local/api/repository/lesson';
import CWTitleGroup from '@component/web/cw-title-group';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const { classId, extraId, subjectId } = useParams({ strict: false });

  const [unlockedGroups, setUnlockedGroups] = useState<UnlockedGroup[]>([]);
  const [allGroups, setAllGroups] = useState<GroupUnlock[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, setPagination } = usePagination();

  const [lessonDetail, setLessonDetail] = useState<LessonResponse>();
  const [fetching, setFetching] = useState(false);
  const [standardData, setStandardData] = useState<LevelItem['standard']>();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const handleStandardReceived = (standard: LevelItem['standard']) => {
    setStandardData(standard);
  };

  // useEffect(() => {
  //   fetchSubLessons();
  // }, [
  //   sublessonId,
  // ]);

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
  useEffect(() => {
    fetchLessonDetail();
  }, []);

  const fetchLessonDetail = async () => {
    try {
      const response = await LessonRestAPI.GetLessons(
        classId,
        pagination.page,
        pagination.limit,
        undefined, // status
        undefined, // curriculumGroupId
        undefined, // subjectId
        extraId, // lesson_id
        true,
      );

      if (response.data.length > 0) {
        setLessonDetail(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch lesson detail:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนได้', 'error');
    }
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'จัดการบทเรียน', href: '#' },
          { label: `${lessonDetail?.subject}`, href: '#' },
          { label: `บทที่ ${lessonDetail?.lesson_id}`, href: '#' },
        ]}
      />
      <div className="my-5 w-full">
        <CWTitleBack label="เพิ่มการเข้าถึงเฉพาะกลุ่มเรียน" href={`../../../../`} />
      </div>

      <div className="mt-5 flex w-full flex-col gap-5 rounded-md bg-neutral-100 px-3 py-3">
        <h1 className="text-[24px] font-bold">{lessonDetail?.lesson_name}</h1>
        <div className="">
          <p className="text-[14px]">
            {lessonDetail?.curriculum_group_short_name} / {lessonDetail?.subject} /{' '}
            {lessonDetail?.year}
          </p>
        </div>
      </div>

      <div className="mb-5 mt-5 w-full">
        <CWUnlock
          unlockedGroups={unlockedGroups}
          setUnlockedGroups={setUnlockedGroups}
          allGroups={allGroups}
          fetchGroups={fetchGroups}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
